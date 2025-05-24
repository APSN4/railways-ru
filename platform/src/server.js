const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const Typesense = require('typesense')
var fs = require('fs/promises');
const dotenv = require("dotenv");
dotenv.config();

let client = new Typesense.Client({
    'nodes': [{
        'host': 'localhost',
        'port': 8108,
        'protocol': 'http'
    }],
    'apiKey': process.env.API_KEY_SEARCH,
    'connectionTimeoutSeconds': 2
})

async function init() {
    const dataset = await fs.readFile("storage/data.json", "utf-8");

    try {
        await client.collections('railway_stations').delete();
        console.log("🗑 Коллекция railway_stations удалена");
    } catch (err) {
        if (err.httpStatus === 404) {}
    }

    await client.collections().create({
        name: 'railway_stations',
        fields: [
            { name: 'title', type: 'string' },
            { name: 'address', type: 'string', optional: true },
            { name: 'phone', type: 'string', optional: true },
            { name: 'working_hours', type: 'string', optional: true },
            { name: 'direction', type: 'string', optional: true },
            { name: 'service', type: 'string', optional: true },
            { name: 'additional_service', type: 'string', optional: true },
            { name: 'accessibility', type: 'string', optional: true },
            { name: 'additional_info', type: 'string', optional: true },
            { name: 'photo', type: 'string', optional: true },
            { name: 'position', type: 'string[]', optional: true }
        ],
    });

    await client.collections('railway_stations')
        .documents()
        .import(dataset);

    console.log("✅ Данные импортированы");
}

init();

const app = express();
app.use(cors());

app.get("/api/timetable", async (req, res) => {
    const { url } = req.query;
    if (!url) return res.status(400).json({ error: "URL required" });

    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const rows = [];

        $("table[data-ti='timetable-table'] tr[data-ti='timetable-row']").each((i, el) => {
            const time = $(el).find("[data-ti='train-time']").text().trim();
            const number = $(el).find("[data-ti='train-number']").text().trim();
            const direction = $(el).find("[data-ti='train-direction-link']").text().trim();
            const status = $(el).find("[data-ti='train-status']").text().trim();

            rows.push({ time, number, direction, status });
        });

        res.json({ rows });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch or parse timetable" });
    }
});

app.post("/api/search", async (req, res) => {
    try {
        const { q, query_by, sort_by } = req.body;

        if (!q || !query_by) {
            return res.status(400).json({ error: "Missing required fields: q, query_by" });
        }

        const searchParameters = {
            q,
            query_by,
            sort_by: sort_by || ''
        };

        const result = await client
            .collections("railway_stations")
            .documents()
            .search(searchParameters);

        res.json(result);
    } catch (err) {
        console.error("Search error:", err);
        res.status(500).json({ error: "Search failed" });
    }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
