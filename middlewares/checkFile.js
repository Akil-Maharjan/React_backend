import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bucket from '../utils/firebaseAdmin.js';

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];

export const checkFile = async (req, res, next) => {
  // First validate the request URL
  if (!req.url || typeof req.url !== 'string') {
    return res.status(400).json({ error: 'Invalid request' });
  }

  if (!req.files?.image) {
    return next();
  }

  const image = req.files.image;
  const extType = path.extname(image.name).toLowerCase();

  if (!supportedExtensions.includes(extType)) {
    return res.status(400).json({ error: 'Unsupported file type' });
  }

  try {
    const filename = `${uuidv4()}${extType}`;
    const file = bucket.file(filename);
    
    await file.save(image.data, {
      metadata: {
        contentType: image.mimetype,
        metadata: {
          originalName: image.name
        }
      }
    });

    req.imageInfo = {
      url: `https://storage.googleapis.com/${bucket.name}/${filename}`,
      filename
    };
    next();
  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
};