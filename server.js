const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const upload = multer();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('✅ Catbox proxy is running!');
});

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const form = new FormData();
    form.append('reqtype', 'fileupload');
    form.append('userhash', req.body.userhash);
    form.append('fileToUpload', req.file.buffer, 'upload.png');

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: form
    });

    const result = await response.text();
    res.json({ url: result.trim() });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Proxy running on port ${port}`);
});
