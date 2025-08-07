import path from 'path';

const supExtType = ['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'];

export const checkFile = (req, res, next) => {
  const image = req.files?.image;

  if (!image) return res.status(400).json({ message: 'Please provide an image' });

  const extType = path.extname(image.name).toLowerCase();
  const imagePath = `uploads/${image.name}`;

  if (!supExtType.includes(extType)) {
    return res.status(400).json({ message: 'Unsupported image format' });
  }

  image.mv(`./${imagePath}`, (err) => {
    if (err) return res.status(500).json({ message: `Error saving image: ${err}` });

    req.imagePath = imagePath;
    next();
  });
};

export const updateCheckFile = (req, res, next) => {
  const image = req.files?.image;

  if (!image) return next(); // No new image, just proceed

  const extType = path.extname(image.name).toLowerCase();
  const imagePath = `uploads/${image.name}`;

  if (!supExtType.includes(extType)) {
    return res.status(400).json({ message: 'Unsupported image format' });
  }

  image.mv(`./${imagePath}`, (err) => {
    if (err) return res.status(500).json({ message: `Error saving image: ${err}` });

    req.imagePath = imagePath;
    next();
  });
};
