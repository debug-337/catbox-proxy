const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const upload = multer({ storage: multer.memoryStorage() }); // use memory storage for files

const USER_HASH = process.env.USER_HASH || '26157003508071abe008d2b03'; // safe fallback

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  // Debugging info
  console.log({
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.buffer.length
  });

  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('userhash', USER_HASH);
    formData.append('fileToUpload', req.file.buffer, {
      filename: req.file.originalname || 'upload.png',
      contentType: req.file.mimetype || 'image/png'
    });

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders()
    });

    const text = await response.text();

    if (!response.ok) {
      console.error('Catbox upload failed:', text);
      return res.status(response.status).send(`Catbox upload failed: ${text}`);
    }

    res.send(text);
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).send(`Server error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
