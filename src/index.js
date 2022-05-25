import './scss/estilos.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';

const token = process.env.MAPBOX_TOKEN;

// Crear nuevo mapa usando un estilo y un token de MapBox
mapboxgl.accessToken = token;
const mapa = new mapboxgl.Map({
  container: 'mapa', // ID del contenedor
  style: 'mapbox://styles/enflujo/cl3kdh8bp006b14lowcxmiwyd', // URL del estilo
  center: [-74.0791, 4.5462], // posición inicial del mapa [long, lat]
  zoom: 10, // zoom inicial
});

console.log('..:: EnFlujo ::..');
