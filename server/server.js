import express from 'express';
import fs from 'fs';
import cors from 'cors';
import sensores from './store/data.js';

const tokens = JSON.parse(fs.readFileSync('./store/tokens.json', 'utf-8'));
const app = express();
const PORT = 3000;
const HOST = 'http://localhost:5173';

app.use(cors({ origin: HOST, credentials: true }));
app.use(express.json());

function checkToken(apiToken,res){
    if (!tokens.some(t => t.token === apiToken)) {
      console.warn("Invalid token:", apiToken);
      res.status(401).json({ error: "Invalid token" });
      return false;
    }
    return true;
}

// --- POST all sensores (auth token required) ---
app.post("/sensores", async (req, res) => {
  try {
    const apiToken = req.body.token;
    console.log("Fetching sensores with token:", apiToken);
    if (checkToken(apiToken,res))
      res.json(sensores);
    return;
  } catch (err) {
    console.error("Error fetching sensores:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- POST: create new sensor ---
app.post('/sensores/update', async (req, res) => {
  try {
    const { sensor, token} = req.body;
    if (!checkToken(token,res)) return;
    console.log("Creating new sensor:", req.body);

    if (!sensor) return res.status(400).json({ error: "Missing sensor data" });

    // Genera nuovo id
    const newSensor = {
      id: sensores.length ? Math.max(...sensores.map(s => s.id)) + 1 : 1,
      ...sensor
    };

    sensores.push(newSensor);

    console.log("Sensor created:", newSensor);
    res.json(newSensor);
  } catch (err) {
    console.error("Error creating sensor:", err);
    res.status(500).json({ error: "Failed to create sensor" });
  }
});

// --- PUT: update sensor ---
app.put('/sensores/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = sensores.findIndex(s => s.id === id);

    if (index === -1) {
      console.warn("Sensor not found for update:", id);
      return res.status(404).json({ error: 'Sensor not found' });
    }

    sensores[index] = { ...sensores[index], ...req.body };
    console.log("Sensor updated:", sensores[index]);

    res.json(sensores[index]);
  } catch (err) {
    console.error("Error updating sensor:", err);
    res.status(500).json({ error: "Failed to update sensor" });
  }
});

// --- DELETE sensor ---
app.delete('/sensores/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);
    const index = sensores.findIndex(s => s.id === id);

    if (index === -1) {
      console.warn("Sensor not found for delete:", id);
      return res.status(404).json({ error: 'Sensor not found' });
    }

    const deleted = sensores.splice(index, 1);
    console.log("Sensor deleted:", deleted[0]);

    res.json(deleted[0]);
  } catch (err) {
    console.error("Error deleting sensor:", err);
    res.status(500).json({ error: "Failed to delete sensor" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
