# 🚉 Railways-ru

**Railways-ru** is a full-stack project for visualizing railway station data across Russia. The project consists of three core components:

1. **Python Scraping Script**: Scrapes data from the website [tutu.ru](https://www.tutu.ru), parses detailed information about railway stations, and generates a JSON dataset. Includes a secondary utility script.
2. **Frontend Client**: Built using Vite and Leaflet, it visualizes the stations on an interactive map.
3. **Backend Server**: Provides real-time API endpoints for live web scraping of current train routes and search functionality.

---

## 📦 Project Structure

```
Railways-ru/
├── scripts/               # Python scrapers and utilities
├── platform/              # Vite + Leaflet frontend
│   ├── storage/
│   ├── src/
│   └── ...
├── tutu-scraping/         # Express/Node backend API
├── docker-compose.yml     # For running Typesense search engine
└── README.md              # You're here!
```

---

## 🧠 Features

* Data scraped from [tutu.ru](https://www.tutu.ru) and enriched with geolocation using Yandex Geocoder API.
* Covers **367** railway stations across Russia.
* Each station includes:

  * Address
  * Phone number
  * Working hours
  * Directions
  * Services available
  * Nearby facilities
  * Accessibility features
  * Additional notes
  * Image
  * Geolocation
* Interactive Leaflet map with customized popups.
* Expandable station details in popups for better readability.
* Real-time route info fetched dynamically via the backend API (scrapes tutu.ru on request).
* Built-in search powered by the open-source search engine **Typesense**.

---

## 🔍 Search Engine: Typesense

We use **Typesense** as a fast, open-source full-text search engine:

* The backend creates and maintains the dataset schema.
* Data is uploaded and indexed automatically.
* `/api/search` provides filtered and ranked results.
* Results are clickable and auto-center the map on the selected station.

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/en) (v18+ recommended)
* Docker (for running the search engine)

### 1. Start the Search Engine

```bash
docker-compose up -d --build
```

To stop and remove volumes:

```bash
docker-compose down -v
```

### 2. Install Dependencies

From the root folder:

```bash
cd platform
npm install
```

### 3. Run the Backend Server

```bash
npm run server
```

### 4. Run the Frontend Dev Server

```bash
npm run dev
```

---


## 🛠 Technologies Used

* **Python** (BeautifulSoup, Requests) — Web scraping
* **Node.js + Express** — Backend API
* **Typesense** — Full-text search
* **Vite + Leaflet** — Frontend map
* **Yandex Geocoder API** — Geolocation

---

## 📍 Data Notes

* All geolocation was derived using the Yandex Geocoder API based on tutu.ru addresses.
* Missing data was completed manually where possible.
* Data is provided in ready-to-use JSON format.
