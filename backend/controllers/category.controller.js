import Category from '../models/Category.js';
import { processAndSaveImage } from '../utils/imageUpload.js';
import { deleteImage } from '../utils/imageDelete.js';

// Helper to convert base64 to buffer if needed
const getBufferFromBase64 = (base64Str) => {
  const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64Data, 'base64');
};

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
    
    // Process Multer file if uploaded
    if (req.file) {
      try {
        imageUrl = await processAndSaveImage(req.file.buffer, 'logos');
      } catch (err) {
        console.error('Local category upload error:', err);
        return res.status(500).json({ message: 'Error uploading category image locally' });
      }
    } 
    // Process Base64 image if sent by frontend
    else if (image && image.startsWith('data:image')) {
      try {
        const buffer = getBufferFromBase64(image);
        imageUrl = await processAndSaveImage(buffer, 'logos');
      } catch (err) {
        console.error('Local category base64 upload error:', err);
        return res.status(500).json({ message: 'Error uploading base64 image locally' });
      }
    } else if (image) {
      imageUrl = image; // already a URL
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
    
    // Process Multer file if uploaded
    if (req.file) {
      try {
        imageUrl = await processAndSaveImage(req.file.buffer, 'logos');
        // Delete old image
        if (category.image && category.image !== imageUrl) {
          deleteImage(category.image);
        }
      } catch (err) {
        console.error('Local category upload error:', err);
        return res.status(500).json({ message: 'Error uploading image' });
      }
    } 
    // Process Base64 image if sent by frontend
    else if (image && image.startsWith('data:image')) {
      try {
        const buffer = getBufferFromBase64(image);
        imageUrl = await processAndSaveImage(buffer, 'logos');
        // Delete old image
        if (category.image && category.image !== imageUrl) {
          deleteImage(category.image);
        }
      } catch (err) {
        console.error('Local category base64 upload error:', err);
        return res.status(500).json({ message: 'Error uploading image locally' });
      }
    } else if (image !== undefined) {
      if (image !== category.image) {
         // Different URL provided, maybe clear image
         if (category.image) deleteImage(category.image);
      }
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
    
    if (category.image) {
      deleteImage(category.image);
    }

    await category.deleteOne();
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Error deleting category' });
  }
};
