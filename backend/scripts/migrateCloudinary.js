import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import { processAndSaveImage } from '../utils/imageUpload.js';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import Banner from '../models/Banner.js';
import Retailer from '../models/Retailer.js';

dotenv.config();

const downloadImageToBuffer = async (url) => {
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
  } catch (error) {
    console.error(`Failed to download ${url}:`, error.message);
    return null;
  }
};

const migrate = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // 1. Migrate Products
    console.log('Migrating Products...');
    const products = await Product.find({});
    for (const product of products) {
      if (product.images && product.images.length > 0) {
        let updated = false;
        const newImages = [];
        for (const imgUrl of product.images) {
          if (imgUrl.includes('cloudinary.com')) {
            console.log(`Downloading ${imgUrl}`);
            const buffer = await downloadImageToBuffer(imgUrl);
            if (buffer) {
              const newUrl = await processAndSaveImage(buffer, 'menu');
              newImages.push(newUrl);
              updated = true;
            } else {
              newImages.push(imgUrl); // Keep old if failed
            }
          } else {
            newImages.push(imgUrl); // Already local or other
          }
        }
        if (updated) {
          product.images = newImages;
          await product.save();
          console.log(`Updated Product: ${product.name}`);
        }
      }
    }

    // 2. Migrate Categories
    console.log('Migrating Categories...');
    const categories = await Category.find({});
    for (const category of categories) {
      if (category.image && category.image.includes('cloudinary.com')) {
        const buffer = await downloadImageToBuffer(category.image);
        if (buffer) {
          category.image = await processAndSaveImage(buffer, 'logos');
          await category.save();
          console.log(`Updated Category: ${category.categoryName}`);
        }
      }
    }

    // 3. Migrate Banners
    console.log('Migrating Banners...');
    const banners = await Banner.find({});
    for (const banner of banners) {
      if (banner.image && banner.image.includes('cloudinary.com')) {
        const buffer = await downloadImageToBuffer(banner.image);
        if (buffer) {
          banner.image = await processAndSaveImage(buffer, 'banners');
          await banner.save();
          console.log(`Updated Banner: ${banner.title}`);
        }
      }
    }

    // 4. Migrate Retailers
    console.log('Migrating Retailers...');
    const retailers = await Retailer.find({});
    for (const retailer of retailers) {
      if (retailer.photo && retailer.photo.includes('cloudinary.com')) {
        const buffer = await downloadImageToBuffer(retailer.photo);
        if (buffer) {
          retailer.photo = await processAndSaveImage(buffer, 'users');
          await retailer.save();
          console.log(`Updated Retailer: ${retailer.name}`);
        }
      }
    }

    console.log('Migration Completed Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration Error:', error);
    process.exit(1);
  }
};

migrate();
