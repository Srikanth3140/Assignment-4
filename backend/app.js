const express = require('express');
const app = express();

const PORT = 8080;

app.get('/', (req, res) => {
  res.json({ message: "Hello from Backend 🚀" });
});

app.get('/health', (req, res) => {
  res.status(200).send("OK");
});

let requestCount = 0;

app.get('/metrics', (req, res) => {
  requestCount++;
  res.set('Content-Type', 'text/plain');
  res.send(`http_requests_total ${requestCount}`);
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});