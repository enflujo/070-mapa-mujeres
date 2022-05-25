import './scss/estilos.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

const token = process.env.MAPBOX_TOKEN;

if (token !== '') {
  mapboxgl.accessToken = token;
  const mapa = new mapboxgl.Map({
    container: 'mapa', // container ID
    style: 'mapbox://styles/enflujo/cl3kdh8bp006b14lowcxmiwyd', // style URL
    center: [-74.0791, 4.5462], // starting position [lng, lat]
    zoom: 10, // starting zoom
  });
}

console.log('..:: EnFlujo ::..');
