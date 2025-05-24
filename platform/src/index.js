import "leaflet/dist/leaflet.css";  // импорт стилей Leaflet
import L from "leaflet";

const map = L.map("map").setView([55.7558, 37.6173], 11);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

fetch("storage/data.json")
    .then((response) => response.json())
    .then((data) => {
        data.train_stations.forEach((station) => {
            if (station.position == null) {
                return
            }
            const marker = L.marker([station.position[0], station.position[1]])
                .addTo(map)
                .bindPopup(`<b>${station.title}</b><br>${station.address}`);
        });
    })
    .catch((err) => console.error("Ошибка загрузки данных:", err));
