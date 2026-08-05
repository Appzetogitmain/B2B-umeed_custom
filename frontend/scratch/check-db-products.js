import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://sagarkiaan12_db_user:umeed123@cluster0.jp0uwmw.mongodb.net/?appName=Cluster0';

async function check() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB Atlas!');
    
    // Define simple schema
    const productSchema = new mongoose.Schema({
      name: String,
      images: [String]
    }, { collection: 'products' });
    
    const Product = mongoose.model('Product', productSchema);
    
    const products = await Product.find({});
    console.log(`Found ${products.length} products:`);
    products.forEach(p => {
      console.log(`- Product: "${p.name}" (ID: ${p._id})`);
      console.log(`  Images:`, p.images);
    });
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
