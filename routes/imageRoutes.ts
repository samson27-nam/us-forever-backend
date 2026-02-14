import express from 'express';
import multer from 'multer';
import { getImages, uploadImage } from '../controllers/imageController';

const router = express.Router();

// Configure Multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Use any cast to satisfy Express RequestHandler requirements when type definitions are out of sync
router.get('/', getImages as any);
// Cast multer middleware to any to resolve RequestHandler type conflicts
router.post('/upload', upload.single('image') as any, uploadImage as any);

export default router;