const express = require('express');
const multer = require('multer');
const { PDFDocument, rgb } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 8080;

// Setup Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

// Serve static files (uploaded PDFs, index.html, css, js)
app.use(express.static(path.join(__dirname)));

// Serve index.html at the root of the server
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Upload and Sign PDF Route
app.post('/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Load the uploaded PDF
    const pdfBytes = fs.readFileSync(req.file.path);
    const pdfDoc = await PDFDocument.load(pdfBytes);

    // Example: Add text to the first page (you can replace this with actual signing logic)
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    firstPage.drawText('Signed by Cloud App', {
      x: 50,
      y: 500,
      size: 30,
      color: rgb(0, 0, 0),
    });

    // Save the signed PDF
    const signedPdfBytes = await pdfDoc.save();

    // Write the signed PDF to disk
    const signedPdfPath = path.join('uploads', 'signed_' + req.file.filename);
    fs.writeFileSync(signedPdfPath, signedPdfBytes);

    // Return the signed PDF URL
    res.send({ url: `/${signedPdfPath}` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error signing the PDF.');
  }
});

// Start the server
app.listen(port, '0.0.0.0', () => {
  console.log(`PDF Signing Service is running at http://localhost:${port}`);
});
