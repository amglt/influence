const path = require('path');
const express = require('express');
const dotenv = require('dotenv');

dotenv.config();

const DIST_DIR = path.join(__dirname, 'dist');
const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.static(DIST_DIR));

app.get('*', function (req, res) {
  res.sendFile(path.join(DIST_DIR, 'index.html'));
});

app.listen(PORT);
