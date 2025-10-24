import express from 'express'
import sensorData from './data.js'
import fs from 'fs';
import cors from 'cors'

const tokens = JSON.parse(fs.readFileSync('./tokens.json', 'utf-8'));

const app = express();
const PORT = 3000;

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // il tuo frontend
    methods: [
        'GET', 'POST', 'OPTIONS'
    ],
    credentials: true
}));
app.use(express.json()); // per leggere JSON nel body

let message = "Server ready to listen";

const initialMessage = `
  <div id="main">
    <h1>${message}</h1>
    ${sensorData.map((item) => `
      <p>${JSON.stringify(item)}</p>
    `).join('')}
  </div>
  <style>
    html,body{
    margin:0;
    padding:0;
    }
   #main {
  color: #FFFFFF;
  background-color: #000000;
  width: 100vw;
  min-height: 100vh; /* 👈 invece di height */
  display: flex;
  flex-direction: column;
  margin: 0;
  padding: 1rem;
  justify-content: flex-start; /* 👈 inizia dall'alto */
  align-items: center;
  overflow-y: auto; /* 👈 abilita lo scroll se serve */
}
  </style>
`;

app.get("/", (req, res) => {
    res.send(initialMessage);
});

app.post("/sensores", (req, res) => {
    const apiToken = req.body.token;
    console.log("token  == ", apiToken);
    if (tokens.some(t => t.token === apiToken)) {
        return res.send(JSON.stringify(sensorData));
    }
    res
        .status(401)
        .send("error: invalid token!");
});

app.listen(PORT, () => {
    console.log(`app listening on http://localhost:${PORT}/`);
});
