import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './MapView.scss';
import '@fortawesome/fontawesome-free/css/fontawesome.min.css';
import '@fortawesome/fontawesome-free/css/solid.min.css';

mapboxgl.accessToken = 'pk.eyJ1IjoieW91c3NlZmFpdGFsaSIsImEiOiJjaXJjYnI1NmswMDdraWZubnN3Ymd1dDl2In0.Vo5ZP-QVh0rs1bIk8Dm-gw';

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
        const map = new mapboxgl.Map({
          container: this.mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [lng, lat],
          zoom: zoom
        });
    }

    render() {
        return (
          <div>
            <div ref={this.mapContainer} className="map-container" />
          </div>
        );
    }
}

export default MapView;