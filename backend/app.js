// server.js
const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config();
const { Pool } = require('pg');


const app = express();
const upload = multer({ dest: 'uploads/' }); // Store uploaded files in 'uploads' folder

// PostgreSQL Configuration
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Endpoint to handle form submission
app.post('/apply', upload.single('media'), async (req, res) => {
  const { category, names } = req.body;
  const mediaLink = req.body.mediaLink || null;
  const mediaFile = req.file ? req.file.filename : null;

  try {
    const query = `
      INSERT INTO loshar (category, names, media_file, media_link)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
    const result = await pool.query(query, [category, names, mediaFile, mediaLink]);
    res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Database error' });
  }
});

// Start server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
