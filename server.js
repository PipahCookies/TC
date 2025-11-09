const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Paths
const UPLOAD_DIR = path.join(__dirname, 'media');
const PRODUCTS_JSON = path.join(__dirname, 'products.json');

// Ensure upload folder exists
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname)
});
const upload = multer({ storage });

// Serve static files
app.use(express.static(__dirname));
app.use('/media', express.static(UPLOAD_DIR));
app.use(express.json());

// Upload endpoint
app.post('/upload', upload.array('files'), (req, res) => {
  const products = req.body.products ? JSON.parse(req.body.products) : [];
  req.files.forEach((file, i) => {
    if (products[i]) products[i].file = file.filename;
  });
  fs.writeFileSync(PRODUCTS_JSON, JSON.stringify(products, null, 2));
  res.json({ status: 'success', products });
});

// Serve products.json
app.get('/products.json', (req, res) => {
  if (fs.existsSync(PRODUCTS_JSON)) {
    res.sendFile(PRODUCTS_JSON);
  } else {
    res.json([]);
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
