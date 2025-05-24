const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

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

const PORT = 3001;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
