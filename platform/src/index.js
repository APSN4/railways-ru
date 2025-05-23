import "leaflet/dist/leaflet.css";  // импорт стилей Leaflet
import L from "leaflet";

const map = L.map("map").setView([55.7558, 37.6173], 11);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);
