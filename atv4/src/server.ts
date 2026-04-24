import express from "express";
import axios, { AxiosError } from "axios";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;
const WEATHERAPI_BASE = "https://api.weatherapi.com/v1";

app.use(express.static(path.join(__dirname, "../views")));
app.use(express.json());

// Rota para buscar clima (WeatherAPI.com)
app.get("/weather", async (req, res) => {
    const city = req.query.city as string;

    if (!city?.trim()) {
        return res.status(400).json({ error: "Cidade não informada" });
    }

    if (!API_KEY) {
        return res.status(500).json({ error: "Chave API_KEY não configurada no servidor (.env)" });
    }

    try {
        const { data } = await axios.get(`${WEATHERAPI_BASE}/current.json`, {
            params: {
                key: API_KEY,
                q: city.trim(),
                lang: "pt"
            }
        });

        let icon = data.current?.condition?.icon as string;
        if (!icon) {
            icon = "";
        } else if (icon.startsWith("//")) {
            icon = `https:${icon}`;
        }
        if (icon.includes("/64x64/")) {
            icon = icon.replace("/64x64/", "/128x128/");
        }

        const weather = {
            city: data.location.name,
            country: data.location.country,
            temperature: data.current.temp_c,
            feels_like: data.current.feelslike_c,
            humidity: data.current.humidity,
            description: data.current.condition.text,
            icon
        };

        res.json(weather);
    } catch (err) {
        if (axios.isAxiosError(err as AxiosError)) {
            const ax = err as AxiosError<{ error?: { message?: string; code?: number } }>;
            const apiErr = ax.response?.data?.error;
            if (apiErr?.message) {
                return res
                    .status(400)
                    .json({ error: apiErr.message });
            }
            if (ax.response?.status === 401) {
                return res.status(401).json({ error: "Chave da API inválida ou inativa" });
            }
        }
        res.status(500).json({ error: "Erro ao buscar o clima. Tente novamente." });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
