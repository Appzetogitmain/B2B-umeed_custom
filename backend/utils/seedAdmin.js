import Admin from '../models/Admin.js';

export const seedDefaultAdmin = async () => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log('🌱 No admins found. Creating default administrator...');
      
      await Admin.create({
        name: 'Umeed Admin',
        email: 'admin@umeed.com',
        password: '123456',
        role: 'SuperAdmin'
      });
      
      console.log('✅ Default admin created: admin@umeed.com / 123456');
    } else {
      console.log('✅ Admins already exist in database.');
    }
  } catch (error) {
    console.error('❌ Error seeding default admin:', error.message);
  }
};
