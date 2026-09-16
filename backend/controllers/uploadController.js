import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure uploads folder exists
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  }
});

// File Filter for PDF, DOCX, PPTX, Images, ZIP
const fileFilter = (req, file, cb) => {
  const allowedExtensions = /jpeg|jpg|png|gif|pdf|doc|docx|ppt|pptx|zip|rar/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (allowedExtensions.test(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC/DOCX, PPT/PPTX, Images, and ZIP files are allowed'), false);
  }
};

export const upload = multer({
  storage,
  limits: { fileSize: 25 * 1024 * 1024 }, // 25MB Max
  fileFilter
});

// POST /api/upload
export const uploadFile = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
    const fileSizeFormatted = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;

    res.status(201).json({
      success: true,
      url: fileUrl,
      fileUrl,
      fileName: req.file.originalname,
      storedName: req.file.filename,
      fileSize: fileSizeFormatted,
      mimeType: req.file.mimetype
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
