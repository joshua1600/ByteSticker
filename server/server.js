console.log('server.js loaded');

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:8080' }));

app.get('/api/ping', (req, res) => res.json({ pong: true }));

app.post('/api/remove-bg', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    const form = new FormData();
    form.append('image_file', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype
    });

    const response = await axios.post('https://api.remove.bg/v1.0/removebg', form, {
      headers: { 
        ...form.getHeaders(), 
        'X-Api-Key': process.env.REMOVEBG_API_KEY 
      },
      responseType: 'arraybuffer'
    });

    if (response.data.includes('error')) {
      throw new Error('Remove.bg API error');
    }

    res.set('Content-Type', 'image/png');
    res.send(response.data);
  } catch (error) {
    console.error('Server Error:', error.message);
    const status = error.response?.status || 500;
    const message = error.response?.data?.errors?.[0]?.title || 'Background removal failed';
    res.status(status).json({ error: message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});