import admin from '../config/firebase.js';
import Retailer from '../models/Retailer.js';
import Partner from '../models/Partner.js';

// Temporary cache to prevent duplicate notifications (stores token_title within last X seconds)
const sentNotifications = new Set();

/**
 * Send a push notification
 * @param {string} userId - Retailer or Partner ID
 * @param {string} userType - 'retailer' or 'partner'
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {object} data - Extra data payload
 */
export const sendPushNotification = async (userId, userType, title, body, data = {}) => {
  try {
    let user;
    if (userType === 'retailer') {
      user = await Retailer.findById(userId);
    } else if (userType === 'partner') {
      user = await Partner.findById(userId);
    }

    if (!user) {
      console.log(`❌ User not found for push notification (${userType}: ${userId})`);
      return;
    }

    const tokens = [];
    if (user.fcmToken) tokens.push(user.fcmToken);
    if (user.fcmTokenMobile) tokens.push(user.fcmTokenMobile);

    if (tokens.length === 0) {
      console.log(`⚠️ No FCM token found for ${userType} ${userId}. Notification skipped.`);
      return;
    }

    // Prepare payload
    // Using an absolute URL for the Umeed logo (can be replaced with cloud URL if hosted)
    const logoUrl = 'https://umeedretailers.com/assets/ur.png'; 
    
    // We send multple messages if they have multiple tokens
    const messages = tokens.map(token => ({
      token,
      notification: {
        title,
        body,
        image: logoUrl,
      },
      data: {
        ...data,
        click_action: "FLUTTER_NOTIFICATION_CLICK", // common standard for background clicks
      },
      android: {
        notification: {
          icon: logoUrl,
          color: '#00a877'
        }
      },
      webpush: {
        notification: {
          icon: logoUrl,
        }
      }
    }));

    for (const message of messages) {
      // Deduplication check
      const cacheKey = `${message.token}_${title}`;
      if (sentNotifications.has(cacheKey)) {
        console.log(`⏭️ Skipped duplicate notification to token: ${message.token.substring(0,10)}...`);
        continue;
      }

      // Add to cache to prevent dupe
      sentNotifications.add(cacheKey);
      setTimeout(() => sentNotifications.delete(cacheKey), 5000); // clear after 5s

      try {
        if (admin && admin.apps.length) {
          const response = await admin.messaging().send(message);
          console.log(`📤 Successfully sent push notification to ${userType} ${userId}:`, response);
        } else {
          console.log(`⚠️ Firebase Admin not initialized, could not send push.`);
        }
      } catch (error) {
        console.error(`❌ Error sending push to token ${message.token.substring(0,10)}:`, error);
        // If token is invalid, we might want to clear it from DB
        if (
          error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered'
        ) {
           console.log(`🧹 Cleaning up invalid token for ${userType} ${userId}`);
           if (message.token === user.fcmToken) user.fcmToken = null;
           if (message.token === user.fcmTokenMobile) user.fcmTokenMobile = null;
           await user.save();
        }
      }
    }
  } catch (error) {
    console.error('❌ Notification service error:', error);
  }
};
