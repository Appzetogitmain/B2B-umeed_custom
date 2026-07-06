import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the service account file dynamically
const serviceAccountPath = path.join(__dirname, 'umeed-7aeef-firebase-adminsdk-fbsvc-9266f0ef65.json');
let serviceAccount = {};

try {
  if (fs.existsSync(serviceAccountPath)) {
    const fileContent = fs.readFileSync(serviceAccountPath, 'utf8');
    serviceAccount = JSON.parse(fileContent);
    
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
      console.log('🔥 Firebase Admin initialized successfully');
    }
  } else {
    console.warn('⚠️ Firebase service account file not found. Push notifications will not work.');
  }
} catch (error) {
  console.error('❌ Failed to initialize Firebase Admin:', error);
}

export default admin;
