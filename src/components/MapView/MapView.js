import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapView.scss';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';

mapboxgl.accessToken = 'pk.eyJ1IjoieW91c3NlZmFpdGFsaSIsImEiOiJjaXJjYnI1NmswMDdraWZubnN3Ymd1dDl2In0.Vo5ZP-QVh0rs1bIk8Dm-gw';
mapboxgl.setRTLTextPlugin(
  'https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js',
  null,
  true // Lazy load the plugin
);
class MapView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          lng: -6,
          lat: 32.5,
          zoom: 7
        };
        this.mapContainer = React.createRef();
    }

    componentDidMount() {
        const { lng, lat, zoom } = this.state;
        this.map = new mapboxgl.Map({
          container: this.mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat],
          zoom: zoom
        })
        .addControl(new mapboxgl.NavigationControl())
        .addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }))
        .addControl(new mapboxgl.FullscreenControl())
        .addControl(new mapboxgl.ScaleControl({
          maxWidth: 80,
          unit: 'metric'
        }));
    }

    handleBaseMaps = (event) => {
      this.map.setStyle('mapbox://styles/mapbox/' + event.target.value);
    }

    render() {
        return (
          <div ref={this.mapContainer} className="map-container">
            <select className="baseMapsDropDown" onChange={e => this.handleBaseMaps(e)}>
                <option value="streets-v11">Streets</option>
                <option value="satellite-v9">Satellite</option>
                <option value="light-v10">Light</option>
                <option value="dark-v10">Dark</option>
            </select>
          </div>
        );
    }
}

export default MapView;