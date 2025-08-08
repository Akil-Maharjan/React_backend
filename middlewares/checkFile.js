import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import bucket from '../utils/firebaseAdmin.js';
import { logger } from '../utils/logger.js'

const supportedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Common file validation function
const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'No file uploaded' };
  
  const extType = path.extname(file.name).toLowerCase();
  if (!supportedExtensions.includes(extType)) {
    return { 
      valid: false, 
      error: 'Unsupported file type',
      supportedTypes: supportedExtensions 
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size exceeds 5MB limit'
    };
  }

  return { valid: true, extType };
};

// For new file uploads
export const checkFile = async (req, res, next) => {
  try {
    if (!req.files?.image) {
      return next();
    }

    const validation = validateImageFile(req.files.image);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    const filename = `${uuidv4()}${validation.extType}`;
    const file = bucket.file(filename);
    
    await file.save(req.files.image.data, {
      metadata: {
        contentType: req.files.image.mimetype,
        metadata: {
          originalName: req.files.image.name,
          uploadedAt: new Date().toISOString(),
          uploadedBy: req.user?.id || 'unknown'
        }
      }
    });

    // Make file publicly accessible
    await file.makePublic();

    req.imageInfo = {
      url: `https://storage.googleapis.com/${bucket.name}/${filename}`,
      filename,
      size: req.files.image.size,
      mimetype: req.files.image.mimetype
    };

    logger.info(`New file uploaded: ${filename}`);
    next();
  } catch (error) {
    logger.error('File upload failed:', error);
    res.status(500).json({ 
      error: 'File upload failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// For updating existing files
export const updateCheckFile = async (req, res, next) => {
  try {
    if (!req.files?.image) {
      return next();
    }

    // Validate the new image
    const validation = validateImageFile(req.files.image);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.error });
    }

    // Delete old image if exists
    if (req.existingImageUrl) { // Should be set by previous middleware
      try {
        const oldFilename = req.existingImageUrl.split('/').pop();
        await bucket.file(oldFilename).delete();
        logger.info(`Deleted old file: ${oldFilename}`);
      } catch (deleteError) {
        logger.error('Old file deletion failed:', deleteError);
        // Continue with new upload anyway
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
          uploadedAt: new Date().toISOString(),
          uploadedBy: req.user?.id || 'unknown',
          isUpdate: true,
          previousImage: req.existingImageUrl || null
        }
      }
    });

    // Make file publicly accessible
    await file.makePublic();

    req.imageInfo = {
      url: `https://storage.googleapis.com/${bucket.name}/${filename}`,
      filename,
      size: req.files.image.size,
      mimetype: req.files.image.mimetype,
      isUpdate: true
    };

    logger.info(`File updated for ${req.params.id}: ${filename}`);
    next();
  } catch (error) {
    logger.error('File update failed:', error);
    res.status(500).json({ 
      error: 'File update failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};