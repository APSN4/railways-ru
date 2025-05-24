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

async function loadTimetablePanel(url) {
    try {
        const res = await fetch(`http://localhost:3001/api/timetable?url=${encodeURIComponent(url)}`);
        const data = await res.json();

        // Удалим старую панель, если есть
        const oldPanel = document.querySelector(".timetable-panel");
        if (oldPanel) {
            oldPanel.remove();
        }

        const container = document.createElement("div");
        container.className = "glass-panel timetable-panel";

        const table = document.createElement("table");
        table.innerHTML = `<thead><tr><th>Время</th><th>Номер</th><th>Маршрут</th><th>Статус</th></tr></thead>`;
        const tbody = document.createElement("tbody");

        data.rows.forEach(row => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${row.time}</td>
                <td>${row.number}</td>
                <td>${row.direction}</td>
                <td>${row.status}</td>
            `;
            tbody.appendChild(tr);
        });

        table.appendChild(tbody);
        container.appendChild(table);
        document.querySelector(".app-container").appendChild(container);

        container.offsetHeight;
        container.classList.add("visible");

        requestAnimationFrame(() => {
            container.classList.add("visible");
        });

    } catch (err) {
        console.error("Ошибка загрузки табло:", err);
    }
}

function closeTimetablePanel() {
    const panel = document.querySelector(".timetable-panel");
    if (!panel) return;

    panel.classList.remove("visible");
    setTimeout(() => {
        panel.remove();
    }, 300);
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
    loadTimetablePanel("https://www.tutu.ru/poezda/Abakan/");
});

map.on("popupclose", (e) => {
    closeTimetablePanel();
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
