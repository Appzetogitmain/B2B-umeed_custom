import Category from '../models/Category.js';
import cloudinary from '../config/cloudinary.js';

// Get all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Error fetching categories' });
  }
};

// Create Category
export const createCategory = async (req, res) => {
  try {
    const { categoryName, image } = req.body;

    if (!categoryName) {
      return res.status(400).json({ message: 'Category Name is required' });
    }

    let imageUrl = '';
    if (image && image.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: 'umeed_categories',
        });
        imageUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
      }
    } else if (image) {
      imageUrl = image;
    }

    const category = await Category.create({
      categoryName,
      image: imageUrl
    });

    res.status(201).json(category);
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ message: 'Error creating category' });
  }
};

// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { categoryName, image } = req.body;

    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    let imageUrl = category.image;
    if (image && image.startsWith('data:image')) {
      try {
        const uploadRes = await cloudinary.uploader.upload(image, {
          folder: 'umeed_categories',
        });
        imageUrl = uploadRes.secure_url;
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    } else if (image !== undefined) {
      imageUrl = image;
    }

    category.categoryName = categoryName || category.categoryName;
    category.image = imageUrl;

    const updatedCategory = await category.save();
    res.json(updatedCategory);
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Error updating category' });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};
