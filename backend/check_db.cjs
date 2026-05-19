const mongoose = require('mongoose');

const uri = "mongodb+srv://sagarkiaan12_db_user:umeed123@cluster0.jp0uwmw.mongodb.net/?appName=Cluster0";

async function run() {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB cluster.");
    
    // Connect to the 'testfolder' database specifically
    const db = mongoose.connection.useDb('testfolder');
    
    const collections = await db.db.listCollections().toArray();
    console.log("\nCollections in 'testfolder' database:");
    collections.forEach(c => console.log(c.name));
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

run();
