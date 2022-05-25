import './scss/estilos.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

const token = process.env.MAPBOX_TOKEN;

if (token !== '') {
  mapboxgl.accessToken = token; // 'pk.eyJ1IjoiZW5mbHVqbyIsImEiOiJjbDNrOXNndXQwMnZsM2lvNDd4N2x0M3dvIn0.eWs4BHs67PcETEUI00T66Q'; //process.env.MAPBOX_TOKEN;
  const mapa = new mapboxgl.Map({
    container: 'mapa', // container ID
    style: 'mapbox://styles/enflujo/cl3kdh8bp006b14lowcxmiwyd', // style URL
    center: [-74.0791, 4.5462], // starting position [lng, lat]
    zoom: 10, // starting zoom
  });
}

console.log('..:: EnFlujo ::..');
