import Banner from '../models/Banner.js';
import cloudinary from '../config/cloudinary.js';

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
    if (image && image.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: 'umeed_banners',
        });
        imageUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
      }
    } else if (image) {
      imageUrl = image;
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
    if (image && image.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: 'umeed_banners',
        });
        imageUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    } else if (image !== undefined) {
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
    await banner.deleteOne();
    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Delete banner error:', error);
    res.status(500).json({ message: 'Error deleting banner' });
  }
};
