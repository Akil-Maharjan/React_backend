import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bucket from '../utils/firebaseAdmin.js';

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Shared validation function
const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'No file uploaded' };
  
  const extType = path.extname(file.name).toLowerCase();
  if (!supportedExtensions.includes(extType)) {
    return { valid: false, error: 'Unsupported file type' };
  }
  return { valid: true, extType };
};

// Original checkFile (unchanged)
export const checkFile = async (req, res, next) => {
  if (req.url.includes('git.new')) {
    return res.status(400).json({ error: 'Invalid request path' });
  }
  if (!req.files?.image) return next();

  const validation = validateImageFile(req.files.image);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    const filename = `${uuidv4()}${validation.extType}`;
    const file = bucket.file(filename);
    
    await file.save(req.files.image.data, {
      metadata: {
        contentType: req.files.image.mimetype,
        metadata: {
          originalName: req.files.image.name
        }
      }
    });

    req.imageInfo = {
      url: `https://storage.googleapis.com/${bucket.name}/${filename}`,
      filename
    };
    next();
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'File upload failed' });
  }
};

// New updateCheckFile
export const updateCheckFile = async (req, res, next) => {
  if (!req.files?.image) return next();

  const validation = validateImageFile(req.files.image);
  if (!validation.valid) {
    return res.status(400).json({ error: validation.error });
  }

  try {
    // Delete old image if exists (expects req.existingImageUrl)
    if (req.existingImageUrl) {
      try {
        const oldFilename = req.existingImageUrl.split('/').pop();
        await bucket.file(oldFilename).delete();
      } catch (deleteError) {
        console.error('Old image deletion failed:', deleteError);
      }
    }

    // Upload new image
    const filename = `${uuidv4()}${validation.extType}`;
    const file = bucket.file(filename);

    await file.save(req.files.image.data, {
      metadata: {
        contentType: req.files.image.mimetype,
        metadata: {
          originalName: req.files.image.name,
          isUpdate: true
        }
      }
    });

    req.imageInfo = {
      url: `https://storage.googleapis.com/${bucket.name}/${filename}`,
      filename,
      isUpdate: true
    };

    next();
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'File update failed' });
  }
};