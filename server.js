const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const upload = multer();

const USER_HASH = '26157003508071abe008d2b03';

app.use(cors());
app.use(express.json());

app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }

  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('userhash', USER_HASH);
    formData.append('fileToUpload', req.file.buffer, {
      filename: req.file.originalname,
      contentType: req.file.mimetype,
    });

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData,
      headers: formData.getHeaders(),
    });

    if (!response.ok) {
      return res.status(500).send('Upload failed');
    }

    const text = await response.text();
    res.send(text);
  } catch (err) {
    res.status(500).send(`Server error: ${err.message}`);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
