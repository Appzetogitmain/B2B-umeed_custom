import Retailer from '../models/Retailer.js';
import Partner from '../models/Partner.js';

export const saveRetailerToken = async (req, res) => {
  try {
    const { token, platform } = req.body;
    const { id } = req.user;

    if (!token) {
      return res.status(400).json({ success: false, message: 'FCM Token is required' });
    }

    // Default to 'fcmToken' (web), if platform is 'app', 'android', or 'ios', use 'fcmTokenMobile'
    const isMobileApp = platform && ['app', 'android', 'ios'].includes(platform.toLowerCase());
    const updateField = isMobileApp ? 'fcmTokenMobile' : 'fcmToken';

    await Retailer.findByIdAndUpdate(id, { [updateField]: token });

    console.log(`✅ Saved ${platform || 'web'} token for retailer ${id}: ${token.substring(0, 10)}...`);
    res.status(200).json({ success: true, message: 'Token saved successfully for retailer' });
  } catch (error) {
    console.error('❌ Error saving FCM token for retailer:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const saveDeliveryToken = async (req, res) => {
  try {
    const { token, platform } = req.body;
    const { id } = req.user;

    if (!token) {
      return res.status(400).json({ success: false, message: 'FCM Token is required' });
    }

    // Default to 'fcmToken' (web), if platform is 'app', 'android', or 'ios', use 'fcmTokenMobile'
    const isMobileApp = platform && ['app', 'android', 'ios'].includes(platform.toLowerCase());
    const updateField = isMobileApp ? 'fcmTokenMobile' : 'fcmToken';

    await Partner.findByIdAndUpdate(id, { [updateField]: token });

    console.log(`✅ Saved ${platform || 'web'} token for delivery partner ${id}: ${token.substring(0, 10)}...`);
    res.status(200).json({ success: true, message: 'Token saved successfully for delivery partner' });
  } catch (error) {
    console.error('❌ Error saving FCM token for delivery:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
