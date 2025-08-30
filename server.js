const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// Storage setup - save uploaded files to 'uploads' folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + file.originalname;
    cb(null, uniqueName);
  }
});
const upload = multer({ storage });

// Serve static files (frontend)
app.use(express.static('public'));

// Endpoint to handle image uploads
app.post('/upload', upload.array('photos'), (req, res) => {
  // req.files contains the uploaded files info
  res.json({ message: 'Upload successful!', files: req.files.map(f => f.filename) });
});

// Endpoint to get uploaded images
app.get('/photos', (req, res) => {
  const directoryPath = path.join(__dirname, 'uploads');
  fs.readdir(directoryPath, (err, files) => {
    if (err) return res.status(500).send('Unable to scan files');
    // Return URLs to frontend (assuming files served statically from /uploads)
    res.json(files.map(file => `/uploads/${file}`));
  });
});

// Make uploaded folder static so clients can access images
app.use('/uploads', express.static('uploads'));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
