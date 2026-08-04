import Banner from '../models/Banner.js';
import { processAndSaveImage } from '../utils/imageUpload.js';
import { deleteImage } from '../utils/imageDelete.js';

// Helper to convert base64 to buffer if needed
const getBufferFromBase64 = (base64Str) => {
  const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64Data, 'base64');
};

// Get all banners
export const getBanners = async (req, res) => {
  try {
    const banners = await Banner.find({}).sort({ createdAt: -1 });
    res.json(banners);
  } catch (error) {
    console.error('Get banners error:', error);
    res.status(500).json({ message: 'Error fetching banners' });
  }
};

// Create Banner
export const createBanner = async (req, res) => {
  try {
    const { title, description, image } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let imageUrl = '';

    // Process Multer file if uploaded
    if (req.file) {
      try {
        imageUrl = await processAndSaveImage(req.file.buffer, 'banners');
      } catch (err) {
        console.error('Local banner upload error:', err);
        return res.status(500).json({ message: 'Error uploading banner image locally' });
      }
    }
    // Process Base64 image if sent by frontend
    else if (image && image.startsWith('data:image')) {
      try {
        const buffer = getBufferFromBase64(image);
        imageUrl = await processAndSaveImage(buffer, 'banners');
      } catch (err) {
        console.error('Local banner base64 upload error:', err);
        return res.status(500).json({ message: 'Error uploading base64 image locally' });
      }
    } else if (image) {
      imageUrl = image; // already a URL
    }

    const banner = await Banner.create({
      title,
      description: description || '',
      image: imageUrl
    });

    res.status(201).json(banner);
  } catch (error) {
    console.error('Create banner error:', error);
    res.status(500).json({ message: 'Error creating banner' });
  }
};

// Update Banner
export const updateBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;

    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    let imageUrl = banner.image;

    // Process Multer file if uploaded
    if (req.file) {
      try {
        imageUrl = await processAndSaveImage(req.file.buffer, 'banners');
        // Delete old image
        if (banner.image && banner.image !== imageUrl) {
          deleteImage(banner.image);
        }
      } catch (err) {
        console.error('Local banner upload error:', err);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    }
    // Process Base64 image if sent by frontend
    else if (image && image.startsWith('data:image')) {
      try {
        const buffer = getBufferFromBase64(image);
        imageUrl = await processAndSaveImage(buffer, 'banners');
        // Delete old image
        if (banner.image && banner.image !== imageUrl) {
          deleteImage(banner.image);
        }
      } catch (err) {
        console.error('Local banner base64 upload error:', err);
        return res.status(500).json({ message: 'Error uploading image locally' });
      }
    } else if (image !== undefined) {
      if (image !== banner.image) {
        if (banner.image) deleteImage(banner.image);
      }
      imageUrl = image;
    }

    banner.title = title || banner.title;
    banner.description = description !== undefined ? description : banner.description;
    banner.image = imageUrl;

    const updatedBanner = await banner.save();
    res.json(updatedBanner);
  } catch (error) {
    console.error('Update banner error:', error);
    res.status(500).json({ message: 'Error updating banner' });
  }
};

// Delete Banner
export const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findById(id);
    if (!banner) {
      return res.status(404).json({ message: 'Banner not found' });
    }

    if (banner.image) {
      deleteImage(banner.image);
    }

    await banner.deleteOne();
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ message: 'Error deleting banner' });
  }
};
