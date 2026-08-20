import multer from 'multer';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Basic Multer memory storage (keeps file in memory so sharp can process it)
const storage = multer.memoryStorage();

// File filter to allow only specific image formats
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPG, JPEG, PNG and WEBP are allowed.'), false);
  }
};

// Multer upload middleware (5MB max)
export const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter
});

/**
 * Process and save image to local storage
 * @param {Buffer} buffer - The image buffer from multer
 * @param {String} type - Folder type (menu, restaurants, users, banners, logos)
 * @param {Object} options - Resize options (width, height, quality)
 * @returns {String} The URL path of the saved image
 */
export const processAndSaveImage = async (buffer, type, options = {}) => {
  try {
    // Generate YYYY/MM structure
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Base storage path (inside backend/uploads/images)
    const baseStoragePath = path.join(__dirname, '..', 'uploads', 'images', type, year, month);
    
    // Auto-create directories if they don't exist
    if (!fs.existsSync(baseStoragePath)) {
      fs.mkdirSync(baseStoragePath, { recursive: true });
    }

    // Generate unique filename
    const filename = `${uuidv4()}.webp`;
    const filepath = path.join(baseStoragePath, filename);

    // Default Sharp options
    let sharpInstance = sharp(buffer).webp({ quality: options.quality || 80 });

    // Resize if width or height is provided
    if (options.width || options.height) {
      sharpInstance = sharpInstance.resize({
        width: options.width,
        height: options.height,
        fit: options.fit || sharp.fit.cover,
        withoutEnlargement: true
      });
    }

    // Save the file
    await sharpInstance.toFile(filepath);

    // Return the relative URL format (Best practice for DB storage)
    return `/images/${type}/${year}/${month}/${filename}`;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Image processing failed');
  }
};
