import React from 'react';
import { defaults as defaultControls } from 'ol/control';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import { OSM } from 'ol/source';
import { get } from 'ol/proj';
import { register } from 'ol/proj/proj4';
import proj4 from 'proj4';
import MousePosition from 'ol/control/MousePosition';
import { createStringXY } from 'ol/coordinate';
import TileArcGISRest from 'ol/source/TileArcGISRest';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import {circular} from 'ol/geom/Polygon';
import Point from 'ol/geom/Point';
import ScaleLine from 'ol/control/ScaleLine';
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import GeoJSON from 'ol/format/GeoJSON';
import Overlay from 'ol/Overlay';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import Draw from 'ol/interaction/Draw';
import { jsPDF } from "jspdf";
import {getLength} from 'ol/sphere';
import {unByKey} from 'ol/Observable';

import 'ol/ol.css';
import './MapView.scss';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';

class MapView extends React.Component {

    constructor(props){

        super(props);

        // Define Custom Projected Cootdinates System
        proj4.defs("EPSG:8838","+proj=utm +zone=38 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs");
        register(proj4);

        // State initialization
        this.state = {
            baseMapsList: {
                'osm': new TileLayer({source: new OSM()}),
                'esri-imagery': new TileLayer({
                    source: new TileArcGISRest({
                        url: "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
                    })
                })
            },
            overlayers: {
                'parcels': {}
            }
        }

        this.map = new Map({
            controls: defaultControls({attribution: false}).extend([
              new MousePosition({
                coordinateFormat: createStringXY(2),
                projection: get('EPSG:8838'),
                className: 'custom-mouse-position',
                undefinedHTML: ' إحداثيات المؤشر',
               }),
               new ScaleLine({
                units: 'metric',
               })
            ]),
            layers: [
                this.state.baseMapsList['osm']
            ],
            view: new View({
              projection: get('EPSG:8838')
            })
        });

        //Define VectorLayer for GPS position marker
        this.gpsSource = new VectorSource();
        this.gpsLayer = new VectorLayer({
            source: this.gpsSource
        });
        this.map.addLayer(this.gpsLayer);
    }

    componentDidMount() {

        this.map.setTarget("map-container");

        //Load and render parcels data from database
        fetch('http://localhost:3001/parcels')
        .then(response => response.json())
        .then(parcels => {
            try {
                    parcels.crs = {
                        'type': 'name',
                        'properties': {
                        'name': get('EPSG:8838'),
                        },
                    };

                    let vectorLayer = new VectorLayer({
                        source: new VectorSource({
                        features: new GeoJSON().readFeatures(parcels),
                        })
                    });

                    this.setState({
                        overlayers: {
                            'parcels': {
                                'layer': vectorLayer,
                                'isVisible': true
                            }
                        }
                    });

                    this.map.addLayer(vectorLayer); 
                    this.map.getView().fit(vectorLayer.getSource().getExtent());
                
            } catch(error) {
                console.log('Error happened while fetching parcels!');
            }
        });

        //Initialize popup parameters

        let popupContainer = document.createElement('div');
        popupContainer.className = 'ol-popup';

        let popupContent = document.createElement('popup-content');

        let popupCloser = document.createElement('span');
        popupCloser.style.cursor = 'pointer'
        popupCloser.className = 'ol-popup-closer';

        popupContainer.appendChild(popupCloser);
        popupContainer.appendChild(popupContent);

        let parcelOverlay = new Overlay({
            element: popupContainer,
            autoPan: true,
            autoPanAnimation: {
                duration: 250,
            },
            stopEvent: false,
        });

        popupCloser.onclick = function () {
            parcelOverlay.setPosition(undefined);
        };

        //Define a click event listener on Map to shop info popups

        let highlightStyle = new Style({
            stroke: new Stroke({
                color: '#f00',
                width: 1,
            }),
            fill: new Fill({
                color: 'rgba(255,0,0,0.1)',
            }),
        });
              
        let highlightOverlay = new VectorLayer({
            source: new VectorSource(),
            map: this.map,
            style: function () {
                return highlightStyle;
            },
        });

        let highlightFeature;
        
        this.map.on('click', (evt)=>{

            let feature = this.map.getFeaturesAtPixel(evt.pixel)[0];

            if(feature!==undefined && !parcelOverlay.getPosition()) {
    
                parcelOverlay.setPosition(evt.coordinate);
                popupContent.innerHTML = "معلومات حول البقعة";
                this.map.addOverlay(parcelOverlay);

                if(feature!==highlightFeature) {

                    if(highlightFeature) {
                            highlightOverlay.getSource().removeFeature(highlightFeature);
                    }

                    highlightFeature = feature;
                    highlightOverlay.getSource().addFeature(highlightFeature);

                } else {
                    
                }

            } else {
                if(highlightFeature) {
                    highlightOverlay.getSource().removeFeature(highlightFeature);
                    highlightFeature = null;
                }
            }
        
        });

        //Define a pointer move event listener on Map to highlight features

        this.map.on('pointermove', (evt) => {
            if(this.map.getFeaturesAtPixel(evt.pixel).length) {
                this.map.getTargetElement().style.cursor = 'pointer';
            } else {
                this.map.getTargetElement().style.cursor = 'default';
            }
        })
      
    }

    handleLocateMe = () => {
            
        if(!this.gpsSource.isEmpty()) {
            this.map.getView().fit(this.gpsSource.getExtent(), {
              maxZoom: 16,
              duration: 250
            });
        } else {
            navigator.geolocation.watchPosition((pos) => {
                let coords = [pos.coords.longitude, pos.coords.latitude];
                let accuracy = circular(coords, pos.coords.accuracy);
                let center = new Point(coords);
                
                this.gpsSource.addFeatures([
                      new Feature(accuracy.transform('EPSG:4326', this.map.getView().getProjection())),
                      new Feature(center.transform('EPSG:4326', this.map.getView().getProjection()))
                ]);
              
                this.map.getView().fit(this.gpsSource.getExtent(), {
                    maxZoom: 16,
                    duration: 250
                });
              
            }, function(error) {
                alert(`CANNOT FIND CURRENT POSITION: ${error.message}`);
            }, {
                enableHighAccuracy: true
            });
        }
    }

    handleLayer = () => {

        if(this.state.overlayers['parcels']['isVisible']) {

            this.setState({
                overlayers: {
                    'parcels': {
                        'isVisible': false,
                        'layer': this.state.overlayers['parcels']['layer']
                    }
                    
                }
            });

            this.map.removeLayer(this.state.overlayers['parcels']['layer']);

        } else {

            this.setState({
                overlayers: {
                    'parcels': {
                        'isVisible': true,
                        'layer': this.state.overlayers['parcels']['layer']
                    }
                    
                }
            });

            this.map.addLayer(this.state.overlayers['parcels']['layer']);
        }
    }

    handleInitialExtent = () => {
        this.map.getView().fit(this.state.overlayers['parcels']['layer'].getSource().getExtent(),
        {
            duration: 300
        });
    }

    handleBaseMaps = (event) => {
        let layer = this.state.baseMapsList[event.target.value];
        layer.setOpacity(1);
        this.map.getLayers().setAt(0, layer);
    }
    
    handlePrint = () => {

        let dim = [297, 210];
        let width = Math.round((dim[0] * 300) / 25.4);
        let height = Math.round((dim[1] * 300) / 25.4);

        let mapCanvas = document.createElement('canvas');
        mapCanvas.width = width;
        mapCanvas.height = height;
        let mapContext = mapCanvas.getContext('2d');

        Array.prototype.forEach.call(
            document.querySelectorAll('.ol-layer canvas'),
            function (canvas) {
                if (canvas.width > 0) {
                    let opacity = canvas.parentNode.style.opacity;
                    mapContext.globalAlpha = opacity === '' ? 1 : Number(opacity);
                    let transform = canvas.style.transform;
                    // Get the transform parameters from the style's transform matrix
                    let matrix = transform
                      .match(/^matrix\(([^\(]*)\)$/)[1]
                      .split(',')
                      .map(Number);
                    // Apply the transform to the export map context
                    CanvasRenderingContext2D.prototype.setTransform.apply(
                      mapContext,
                      matrix
                    );
                    mapContext.drawImage(canvas, 0, 0);
                  }
            }
        );
            
        let pdf = new jsPDF('landscape', undefined, 'a4');
            pdf.addImage(
                mapCanvas.toDataURL('image/jpeg'),
                'JPEG',
                0,
                0,
                dim[0],
                dim[1]
        );

        pdf.save('الخريطة.pdf');
        
    }

    createMeasureTooltip = () => {

        let measureTooltipElement = document.createElement('div');
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';

        let measureTooltip = new Overlay({
            element: measureTooltipElement,
            offset: [0, -15],
            positioning: 'bottom-center',
        });

        this.map.addOverlay(measureTooltip);

        return {measureTooltipElement, measureTooltip};

    }

    createHelpTooltip = () => {

        let helpTooltipElement = document.createElement('div');
        helpTooltipElement.className = 'ol-tooltip hidden';

        let helpTooltip = new Overlay({
            element: helpTooltipElement,
            offset: [15, 0],
            positioning: 'center-left',
        });

        this.map.addOverlay(helpTooltip);

        return {helpTooltipElement, helpTooltip};
    }

    formatLength = (line) => {
        let length = getLength(line);
        let output;
        if (length > 100) {
          output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
        } else {
          output = Math.round(length * 100) / 100 + ' ' + 'm';
        }
        return output;
    }

    pointerMoveHandler = (evt, sketch, helpTooltipElement, helpTooltip) => {
       
        if (evt.dragging) {
            return;
        }

        let helpMsg = 'انقر لبدء القياس';

        if (sketch) {
            helpMsg = 'انقر لللإستمرار في القياس';
        }
       
        helpTooltipElement.innerHTML = helpMsg;
        helpTooltip.setPosition(evt.coordinate);
        helpTooltipElement.classList.remove('hidden');

      };
      

    handleMeasureLength = () => {

        let source = new VectorSource();

        let draw = new Draw({
            source: source,
            type: 'LineString',
            style: new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
              }),
              stroke: new Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2,
              }),
              image: new CircleStyle({
                radius: 5,
                stroke: new Stroke({
                  color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new Fill({
                  color: 'rgba(255, 255, 255, 0.2)',
                }),
              }),
            }),
          });

        this.map.addInteraction(draw);

        //Create Measure and Help Tooltips
       
        let { measureTooltipElement,  measureTooltip} = this.createMeasureTooltip();
        let { helpTooltipElement, helpTooltip } = this.createHelpTooltip();

        //Manage measure drawing 

        let sketch;
        let listener;

        this.map.on('pointermove', evt => this.pointerMoveHandler(evt, sketch, helpTooltipElement, helpTooltip));

        draw.on('drawstart', (evt) => {
            
            sketch = evt.feature;
            
            let tooltipCoord = evt.coordinate;

            listener = sketch.getGeometry().on('change', (evt) => {
                let geom = evt.target;
                let output = this.formatLength(geom);

                tooltipCoord = geom.getLastCoordinate();
                measureTooltipElement.innerHTML = output;
                measureTooltip.setPosition(tooltipCoord);
            });
        
        });

        draw.on('drawend', () => {
            measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
            measureTooltip.setOffset([0, -7]);
            sketch = null;
            measureTooltipElement = null;
            this.createMeasureTooltip();
            unByKey(listener);
        });
    }

    render() {
        return (
            <div id="map-container">
                <div className="hiddenOverlay">
                    <div className="layersContainer h-50 shadow-sm rounded">
                        <h4>المعطيات</h4>
                        <div>
                            <input className="form-check-input" type="checkbox" value="" id="defaultCheck1" onChange={this.handleLayer} checked = {this.state.overlayers['parcels']['isVisible']}/>
                            <label className="form-check-label" htmlFor="defaultCheck1">
                                العقارات المتوفرة
                            </label>
                        </div>
                        {/*<div>
                            <input className="form-check-input" type="checkbox" value="" id="defaultCheck2"/>
                            <label className="form-check-label" htmlFor="defaultCheck2">
                                حدود حي ضاحية الملك عبد العزيز - المنح
                            </label>
                        </div>*/}
                    </div>
                    <div className="controlsContainer shadow-sm rounded">
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>الرجوع إلى موقع المعطيات</Tooltip>}>
                                    <button type="button" className="btn btn-light" onClick={this.handleInitialExtent}><i className="fas fa-compress-arrows-alt"></i></button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>إظهار المعلومات الوصفية</Tooltip>}>
                                    <button type="button" className="btn btn-light" onClick={this.handleInitialExtent}><i class="fas fa-info"></i></button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>موقعي على الخريطة</Tooltip>}>
                                    <button type="button" className="btn btn-light" onClick={this.handleLocateMe}><i className="fas fa-crosshairs"></i></button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>قياس المسافة</Tooltip>}>
                                    <button type="button" className="btn btn-light" onClick={this.handleMeasureLength}><i className="fas fa-ruler"></i></button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>قياس المساحة</Tooltip>}>
                                    <button type="button" className="btn btn-light"><i className="fas fa-ruler-combined"></i></button>
                            </OverlayTrigger>
                            <OverlayTrigger
                                placement="top"
                                overlay={<Tooltip>الطباعة</Tooltip>}>
                                    <button type="button" className="btn btn-light" onClick={this.handlePrint}><i className="fas fa-print"></i></button>
                            </OverlayTrigger>
                    </div>
                    <select className="ol-control ol-unselectable baseMapsDropDown" onChange={e => this.handleBaseMaps(e)}>
                        <option value="osm">OpenStreetMap</option>
                        <option value="esri-imagery">Esri Satellite Imagery</option>
                    </select>
                </div>
            </div>
        );
    }
}

export default MapView;