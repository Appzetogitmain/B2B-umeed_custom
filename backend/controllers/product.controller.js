import Product from '../models/Product.js';
import { processAndSaveImage } from '../utils/imageUpload.js';
import { deleteImage } from '../utils/imageDelete.js';

// Helper to convert base64 to buffer if needed
const getBufferFromBase64 = (base64Str) => {
  const base64Data = base64Str.replace(/^data:image\/\w+;base64,/, "");
  return Buffer.from(base64Data, 'base64');
};

// Get all products
export const getProducts = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { sku: { $regex: search, $options: 'i' } },
          { category: { $regex: search, $options: 'i' } }
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

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Get product by ID error:', error);
    res.status(500).json({ message: 'Error fetching product' });
  }
};

// Create Product
export const createProduct = async (req, res) => {
  try {
    const { name, category, variantName, images, existingImages, price, mrp, discount, stock, description } = req.body;

    if (!name || !category || price === undefined || mrp === undefined || stock === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Process and upload images in parallel
    let uploadedImages = [];
    
    // Support both Multer array files and Base64 body images
    const filesToProcess = req.files ? req.files : [];
    
    // Process Multer files if any
    if (filesToProcess.length > 0) {
      try {
        const uploadPromises = filesToProcess.map(file => processAndSaveImage(file.buffer, 'menu'));
        uploadedImages = await Promise.all(uploadPromises);
      } catch (err) {
        console.error('Product image upload error:', err);
        return res.status(500).json({ message: 'Error processing local images' });
      }
    }
    
    // Process Base64 images or URLs if frontend sends them
    let imagesArray = [];
    if (existingImages) {
      try {
        imagesArray = JSON.parse(existingImages);
      } catch (err) {
        imagesArray = Array.isArray(existingImages) ? existingImages : [existingImages];
      }
    } else if (images) {
      imagesArray = Array.isArray(images) ? images : [images];
    }

    if (imagesArray.length > 0) {
      try {
        const base64UploadPromises = imagesArray.map(async (img) => {
          if (img && img.startsWith('data:image')) {
            const buffer = getBufferFromBase64(img);
            return await processAndSaveImage(buffer, 'menu');
          } else if (img) {
            return img; // already a URL
          }
          return null;
        });
        const results = await Promise.all(base64UploadPromises);
        uploadedImages = [...uploadedImages, ...results.filter(url => url !== null)];
      } catch (err) {
        console.error('Product base64 upload error:', err);
        return res.status(500).json({ message: 'Error uploading base64 images locally' });
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
    const { name, category, variantName, images, existingImages, price, mrp, discount, stock, description } = req.body;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Determine old images to find which ones were removed
    const oldImages = product.images || [];
    
    // Process and upload images in parallel
    let uploadedImages = [];
    
    // Process Multer files if any
    if (req.files && req.files.length > 0) {
      try {
        const uploadPromises = req.files.map(file => processAndSaveImage(file.buffer, 'menu'));
        uploadedImages = await Promise.all(uploadPromises);
      } catch (err) {
        console.error('Product image upload error:', err);
        return res.status(500).json({ message: 'Error processing local images' });
      }
    }

    // Process Base64 images or existing URLs
    let retainedImages = [];
    let imagesArray = [];
    if (existingImages) {
      try {
        imagesArray = JSON.parse(existingImages);
      } catch (err) {
        imagesArray = Array.isArray(existingImages) ? existingImages : [existingImages];
      }
    } else if (images) {
      imagesArray = Array.isArray(images) ? images : [images];
    }

    if (imagesArray.length > 0) {
      try {
        const base64UploadPromises = imagesArray.map(async (img) => {
          if (img && img.startsWith('data:image')) {
            const buffer = getBufferFromBase64(img);
            return await processAndSaveImage(buffer, 'menu');
          } else if (img) {
            retainedImages.push(img);
            return img;
          }
          return null;
        });
        const results = await Promise.all(base64UploadPromises);
        uploadedImages = [...uploadedImages, ...results.filter(url => url !== null && !retainedImages.includes(url))];
      } catch (err) {
        console.error('Product base64 upload error:', err);
        return res.status(500).json({ message: 'Error uploading base64 images locally' });
      }
    }

    // The final images list is retained images + newly uploaded images
    const finalImages = [...retainedImages, ...uploadedImages];

    // Delete removed images from local storage
    const removedImages = oldImages.filter(img => !finalImages.includes(img));
    for (const removedImg of removedImages) {
      deleteImage(removedImg);
    }

    product.name = name || product.name;
    product.category = category || product.category;
    product.variantName = variantName !== undefined ? variantName : product.variantName;
    product.images = finalImages;
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
    
    // Clean up local images
    if (product.images && Array.isArray(product.images)) {
      for (const imgUrl of product.images) {
        deleteImage(imgUrl);
      }
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

// Bulk Create Products
export const createProductsBulk = async (req, res) => {
  try {
    const { products } = req.body;

    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({ message: 'Please provide a non-empty list of products' });
    }

    // Validate structure of each product
    for (const prod of products) {
      if (!prod.name || !prod.category || prod.price === undefined || prod.mrp === undefined || prod.stock === undefined) {
        return res.status(400).json({ 
          message: `Product validation failed. Name, Category, Price, MRP, and Stock are required fields for all items. Missing in: ${prod.name || 'Unnamed'}` 
        });
      }
    }

    // Convert values to numbers and assign defaults for each product
    const formattedProducts = products.map(prod => ({
      name: prod.name.trim(),
      category: prod.category.trim(),
      variantName: (prod.variantName || '').trim(),
      price: Number(prod.price),
      mrp: Number(prod.mrp),
      discount: Number(prod.discount || 0),
      stock: Number(prod.stock),
      description: (prod.description || '').trim(),
      images: prod.images && Array.isArray(prod.images) ? prod.images : []
    }));

    // Perform bulk insertion
    const createdProducts = await Product.insertMany(formattedProducts);
    res.status(201).json({
      message: `${createdProducts.length} products uploaded successfully`,
      products: createdProducts
    });
  } catch (error) {
    console.error('Bulk create products error:', error);
    res.status(500).json({ message: error.message || 'Error uploading products in bulk' });
  }
};

