import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Safely deletes a local image file given its URL path
 * @param {String} imageUrl - The URL path of the image (e.g., /images/menu/2026/06/xyz.webp)
 * @returns {Boolean} True if deleted or ignored successfully, False if error
 */
export const deleteImage = (imageUrl) => {
  try {
    if (!imageUrl) return true;

    // Ignore cloudinary urls just in case they are passed during migration period
    if (imageUrl.includes('cloudinary.com')) {
      return true; 
    }

    // Extract path if it's an absolute URL
    let relativePath = imageUrl;
    try {
      if (imageUrl.startsWith('http')) {
        const urlObj = new URL(imageUrl);
        relativePath = urlObj.pathname;
      }
    } catch (e) {
      console.warn(`Could not parse URL in deleteImage: ${imageUrl}`);
    }

    // relativePath format should now be: /images/type/YYYY/MM/filename.webp
    // Remove the leading /images part
    relativePath = relativePath.replace(/^\/images\//, '');
    
    if (relativePath === imageUrl && !imageUrl.startsWith('/images/')) {
      // If it didn't start with /images/, we might not know how to delete it safely
      console.warn(`Attempted to delete unrecognized local path format: ${imageUrl}`);
      return false;
    }

    const absolutePath = path.join(__dirname, '..', 'uploads', 'images', relativePath);

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
      return true;
    } else {
      console.warn(`File not found for deletion: ${absolutePath}`);
      return true; // Already gone
    }
  } catch (error) {
    console.error(`Error deleting image ${imageUrl}:`, error);
    return false;
  }
};
