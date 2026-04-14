import express from 'express';
import multer from 'multer';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

router.post('/', verifyToken, upload.single('picture'), (req, res) => {
  try {
    if (req.file) {
      return res.status(200).json({ message: 'File uploaded', filename: req.file.filename });
    }
    return res.status(400).json({ message: 'No file uploaded' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
