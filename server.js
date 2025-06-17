const express = require('express');
const multer = require('multer');
const fetch = require('node-fetch');
const FormData = require('form-data');
const cors = require('cors');

const app = express();
const upload = multer();
const PORT = process.env.PORT || 10000;

app.use(cors());

app.post('/upload', upload.single('fileToUpload'), async (req, res) => {
  try {
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('userhash', process.env.CATBOX_USERHASH); // stored safely
    formData.append('fileToUpload', req.file.buffer, req.file.originalname);

    const response = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });

    const text = await response.text();
    res.send(text);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
