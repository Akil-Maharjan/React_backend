import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bucket from '../utils/firebaseAdmin.js';

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

// Original middleware for new uploads
export const checkFile = async (req, res, next) => {
  const image = req.files?.image;
  if (!image) return next(); // Skip if no image (for optional uploads)

  const extType = path.extname(image.name).toLowerCase();
  if (!supportedExtensions.includes(extType)) {
    return res.status(400).json({ message: 'Unsupported image format' });
  }

  const filename = `${uuidv4()}${extType}`;
  const file = bucket.file(filename);

  try {
    await file.save(image.data, {
      metadata: { contentType: image.mimetype },
      public: true,
      resumable: false,
    });

    req.imageInfo = {
      url: `https://storage.googleapis.com/${bucket.name}/${filename}`,
      filename: filename
    };
    next();
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

// Specialized middleware for updates
export const updateCheckFile = async (req, res, next) => {
  const image = req.files?.image;
  if (!image) return next(); // Skip if no new image provided

  const extType = path.extname(image.name).toLowerCase();
  if (!supportedExtensions.includes(extType)) {
    return res.status(400).json({ message: 'Unsupported image format' });
  }

  // Delete old image if exists
  if (req.product?.image) { // Assuming product is attached by previous middleware
    try {
      const oldFilename = req.product.image.split('/').pop();
      await bucket.file(oldFilename).delete();
    } catch (deleteError) {
      console.error('Old image deletion failed:', deleteError);
      // Continue with new upload anyway
    }
  }

  // Upload new image
  const filename = `${uuidv4()}${extType}`;
  const file = bucket.file(filename);

  try {
    await file.save(image.data, {
      metadata: { contentType: image.mimetype },
      public: true,
      resumable: false,
    });

    req.imageInfo = {
      url: `https://storage.googleapis.com/${bucket.name}/${filename}`,
      filename: filename,
      isUpdate: true
    };
    next();
  } catch (error) {
    console.error('Update Upload Error:', error);
    res.status(500).json({ message: 'Image update failed' });
  }
};