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

async function loadTimetablePanel(urlObj) {
    try {
        const res = await fetch(`http://localhost:3001/api/timetable?url=${encodeURIComponent(urlObj.link)}`);
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

        if (data.rows.length === 0) {
            table.innerHTML = `<thead>Ой, а сервис нам ничего не ответил...</thead>`;
            const tbody2 = document.createElement("tbody2");
        }

        table.appendChild(tbody);
        container.appendChild(table);

        // Приводим строку к нижнему регистру для надёжного поиска
        const cleanedTitle = urlObj.title.toLowerCase();

        // Ищем ключ в moscowRailwayStations, в котором есть совпадение
        const matchedKey = Object.keys(moscowRailwayStations).find(key =>
            key.toLowerCase().includes(cleanedTitle)
        );

        if (matchedKey) {
            const destinations = moscowRailwayStations[matchedKey];

            // Контейнер для заголовка и кнопок
            const citiesWrapper = document.createElement("div");
            citiesWrapper.className = "cities-wrapper";

            // Заголовок
            const citiesTitle = document.createElement("h3");
            citiesTitle.textContent = "Основные города следования:";
            citiesTitle.className = "cities-title";
            citiesWrapper.appendChild(citiesTitle);

            // Контейнер кнопок
            const citiesContainer = document.createElement("div");
            citiesContainer.className = "cities-container";

            destinations.forEach(city => {
                const btn = document.createElement("button");
                btn.textContent = city.name;
                btn.className = "city-button";
                btn.addEventListener("click", () => {
                    map.setView([city.lat, city.lon], 10);
                });
                citiesContainer.appendChild(btn);
            });

            citiesWrapper.appendChild(citiesContainer);
            container.appendChild(citiesWrapper);
        }

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

const moscowRailwayStations = {
    "Белорусский вокзал": [
        { name: "Минск", lat: 53.893009, lon: 27.567444 },
        { name: "Брест", lat: 52.097622, lon: 23.734051 },
        { name: "Гомель", lat: 52.4345, lon: 30.9754 },
        { name: "Калининград", lat: 54.70028, lon: 20.45306 },
        { name: "Смоленск", lat: 54.7818, lon: 32.0401 },
        { name: "Вильнюс", lat: 54.6892, lon: 25.2798 },
        { name: "Варшава", lat: 52.2297, lon: 21.0122 }
    ],
    "Восточный": [
        { name: "Владимир", lat: 56.12861, lon: 40.40583 },
        { name: "Нижний Новгород", lat: 56.296505, lon: 43.936058 },
        { name: "Иваново", lat: 56.9972, lon: 40.9714 },
        { name: "Орехово-Зуево", lat: 55.8167, lon: 38.9833 },
        { name: "Ковров", lat: 56.3572, lon: 41.3197 }
    ],
    "Казанский вокзал": [
        { name: "Казань", lat: 55.796391, lon: 49.108891 },
        { name: "Самара", lat: 53.241505, lon: 50.221245 },
        { name: "Уфа", lat: 54.733334, lon: 56.000000 },
        { name: "Челябинск", lat: 55.1644, lon: 61.4368 },
        { name: "Екатеринбург", lat: 56.8389, lon: 60.6057 },
        { name: "Рязань", lat: 54.6292, lon: 39.7366 },
        { name: "Пенза", lat: 53.2001, lon: 45.0046 },
        { name: "Саранск", lat: 54.1838, lon: 45.1749 }
    ],
    "Киевский вокзал": [
        { name: "Киев", lat: 50.4501, lon: 30.5234 },
        { name: "Брянск", lat: 53.2521, lon: 34.3717 },
        { name: "Калуга", lat: 54.5293, lon: 36.2754 },
        { name: "Львов", lat: 49.8397, lon: 24.0297 },
        { name: "Чернигов", lat: 51.4982, lon: 31.2893 },
        { name: "Винница", lat: 49.2331, lon: 28.4682 },
        { name: "Одесса", lat: 46.4825, lon: 30.7233 }
    ],
    "Курский вокзал": [
        { name: "Курск", lat: 51.7304, lon: 36.1926 },
        { name: "Белгород", lat: 50.5956, lon: 36.5872 },
        { name: "Воронеж", lat: 51.6608, lon: 39.2003 },
        { name: "Орёл", lat: 52.9673, lon: 36.0696 },
        { name: "Ростов-на-Дону", lat: 47.2357, lon: 39.7015 },
        { name: "Симферополь", lat: 44.9521, lon: 34.1024 },
        { name: "Харьков", lat: 49.9935, lon: 36.2304 }
    ],
    "Ленинградский вокзал": [
        { name: "Санкт-Петербург", lat: 59.9343, lon: 30.3351 },
        { name: "Великий Новгород", lat: 58.5215, lon: 31.2755 },
        { name: "Тверь", lat: 56.8587, lon: 35.9176 },
        { name: "Петрозаводск", lat: 61.7891, lon: 34.3596 },
        { name: "Мурманск", lat: 68.9585, lon: 33.0827 },
        { name: "Псков", lat: 57.8193, lon: 28.3318 }
    ],
    "Павелецкий вокзал": [
        { name: "Тамбов", lat: 52.7212, lon: 41.4523 },
        { name: "Саратов", lat: 51.5304, lon: 45.9530 },
        { name: "Волгоград", lat: 48.7080, lon: 44.5133 },
        { name: "Астрахань", lat: 46.3497, lon: 48.0408 },
        { name: "Липецк", lat: 52.6100, lon: 39.5942 },
        { name: "Балашов", lat: 51.5386, lon: 43.1668 }
    ],
    "Рижский вокзал": [
        { name: "Ржев", lat: 56.2619, lon: 34.3284 },
        { name: "Великие Луки", lat: 56.3403, lon: 30.5452 },
        { name: "Себеж", lat: 56.2906, lon: 28.4725 },
        { name: "Псков", lat: 57.8193, lon: 28.3318 },
        { name: "Даугавпилс", lat: 55.8744, lon: 26.5310 }
    ],
    "Савеловский вокзал": [
        { name: "Дубна", lat: 56.7410, lon: 37.1750 },
        { name: "Кимры", lat: 56.8739, lon: 37.3558 },
        { name: "Бологое", lat: 57.8853, lon: 34.0583 },
        { name: "Калязин", lat: 57.2446, lon: 37.8531 },
        { name: "Сонково", lat: 58.1544, lon: 37.7483 }
    ],
    "Ярославский вокзал": [
        { name: "Ярославль", lat: 57.6261, lon: 39.8845 },
        { name: "Кострома", lat: 57.8020, lon: 40.9900 },
        { name: "Вологда", lat: 59.2205, lon: 39.8915 },
        { name: "Архангельск", lat: 64.5393, lon: 40.5170 },
        { name: "Северобайкальск", lat: 55.6333, lon: 109.3167 },
        { name: "Чита", lat: 52.0340, lon: 113.4994 },
        { name: "Улан-Удэ", lat: 51.8333, lon: 107.6167 },
        { name: "Улан-Батор", lat: 47.9189, lon: 106.9170 },
        { name: "Пекин", lat: 39.9042, lon: 116.4074 }
    ]
};

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

    const marker = e.popup._source;
    const linkIndex = marker.options.link;
    if (dataLinksObj[linkIndex]) {
        loadTimetablePanel(dataLinksObj[linkIndex]);
    }
});

map.on("popupclose", (e) => {
    closeTimetablePanel();
});

let dataLinksObj = [];

fetch("storage/data_links.json")
    .then(res => res.json())
    .then(data => {
        dataLinksObj = data.links;
    });


fetch("storage/data.json")
    .then((response) => response.json())
    .then((data) => {
        data.train_stations.forEach((station, index) => {
            if (station.position == null) {
                return
            }
            const marker = L.marker([station.position[0], station.position[1]], {
                link: index
            }).addTo(map)
                .bindPopup(createPopupHTML(station));
        });
    })
    .catch((err) => console.error("Ошибка загрузки данных:", err));
