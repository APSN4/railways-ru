import "leaflet/dist/leaflet.css";  // импорт стилей Leaflet
import L from "leaflet";

function createPopupHTML(station) {
    const wrap = (label, value, className = "popup-line") =>
        value ? `<p class="${className}"><strong>${label}:</strong> ${value}</p>` : "";

    const html = `
    <div class="popup-content">
      ${station.title ? `<h3>${station.title}</h3>` : ""}
      ${wrap("Адрес", station.address)}
      ${wrap("Телефон", station.phone)}
      ${wrap("Время работы", station.working_hours)}
      ${wrap("Как добраться", station.direction)}
      ${wrap("Услуги", station.service)}
      ${wrap("Доп. услуги", station.additional_service)}
      ${wrap("Доступность", station.accessibility)}
      ${station.additional_info ? `<p class="popup-line">${station.additional_info}</p>` : ""}
      ${
        station.photo
            ? `<img src="${station.photo}" alt="Фото ${station.title}" class="popup-photo" />`
            : ""
    }
    </div>
  `;

    return html;
}


const map = L.map("map").setView([55.7558, 37.6173], 11);

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

map.on("popupopen", (e) => {
    const lines = e.popup._container.querySelectorAll(".popup-line");
    lines.forEach((line) => {
        line.addEventListener("click", () => {
            line.classList.toggle("expanded");
        });
    });
});


fetch("storage/data.json")
    .then((response) => response.json())
    .then((data) => {
        data.train_stations.forEach((station) => {
            if (station.position == null) {
                return
            }
            const marker = L.marker([station.position[0], station.position[1]])
                .addTo(map)
                .bindPopup(createPopupHTML(station));
        });
    })
    .catch((err) => console.error("Ошибка загрузки данных:", err));
