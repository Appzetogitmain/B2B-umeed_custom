import Product from '../models/Product.js';
import cloudinary from '../config/cloudinary.js';

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } }
        ]
      };
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, category, variantName, images, price, mrp, discount, stock, description } = req.body;

    if (!name || !category || price === undefined || mrp === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Process and upload images in parallel
    let uploadedImages = [];
    if (Array.isArray(images)) {
      try {
        const uploadPromises = images.map(async (img) => {
          if (img && img.startsWith('data:image')) {
            const uploadRes = await cloudinary.uploader.upload(img, {
              folder: 'umeed_products',
            });
            return uploadRes.secure_url;
          } else if (img) {
            return img;
          }
          return null;
        });
        const results = await Promise.all(uploadPromises);
        uploadedImages = results.filter(url => url !== null);
      } catch (err) {
        console.error('Cloudinary product upload error:', err);
        return res.status(500).json({ message: 'Error uploading images to Cloudinary' });
      }
    }

    const product = await Product.create({
      name,
      category,
      variantName,
      images: uploadedImages,
      price: Number(price),
      mrp: Number(mrp),
      discount: Number(discount || 0),
      stock: Number(stock),
      description: description || '',
    });

    res.status(201).json(product);
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({ message: 'Error creating product' });
  }
};

// Update Product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, variantName, images, price, mrp, discount, stock, description } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Process and upload images in parallel
    let uploadedImages = [];
    if (Array.isArray(images)) {
      try {
        const uploadPromises = images.map(async (img) => {
          if (img && img.startsWith('data:image')) {
            const uploadRes = await cloudinary.uploader.upload(img, {
              folder: 'umeed_products',
            });
            return uploadRes.secure_url;
          } else if (img) {
            return img;
          }
          return null;
        });
        const results = await Promise.all(uploadPromises);
        uploadedImages = results.filter(url => url !== null);
      } catch (err) {
        console.error('Cloudinary product upload error:', err);
        return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
      }
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.variantName = variantName !== undefined ? variantName : product.variantName;
    product.images = uploadedImages;
    product.price = price !== undefined ? Number(price) : product.price;
    product.mrp = mrp !== undefined ? Number(mrp) : product.mrp;
    product.discount = discount !== undefined ? Number(discount) : product.discount;
    product.stock = stock !== undefined ? Number(stock) : product.stock;
    product.description = description !== undefined ? description : product.description;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ message: 'Error updating product' });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    await product.deleteOne(); // Direct delete from database
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Error deleting product' });
  }
};

// Update Product Stock
export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    if (stock === undefined || isNaN(Number(stock))) {
      return res.status(400).json({ message: 'Valid stock number is required' });
    }

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.stock = Number(stock);
    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Update product stock error:', error);
    res.status(500).json({ message: 'Error updating product stock' });
  }
};

