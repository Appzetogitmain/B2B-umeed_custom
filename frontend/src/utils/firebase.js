import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { getBackendUrl } from './api';

const firebaseConfig = {
  apiKey: "AIzaSyAPCl7G0Z1ONVfpaCcJW1of1FI6Dmmrj2M",
  authDomain: "umeed-7aeef.firebaseapp.com",
  projectId: "umeed-7aeef",
  storageBucket: "umeed-7aeef.firebasestorage.app",
  messagingSenderId: "781928903949",
  appId: "1:781928903949:web:fa1ceab948454cc9786c44",
  measurementId: "G-MRYB4HGRDN"
};

const app = initializeApp(firebaseConfig);

// Messaging instance
let messaging = null;

if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.log('Firebase Messaging initialization error:', error);
  }
}

const isMobile = () => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua) || /iPad|iPhone|iPod/.test(ua)) {
    return true;
  }
  return false;
};

export const requestNotificationPermission = async (userType, jwtToken) => {
  if (!messaging) return;

  try {
    console.log('Requesting notification permission...');
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Permission granted. Registering service worker...');
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      console.log('Waiting for service worker to be ready...');
      await navigator.serviceWorker.ready;
      console.log('Service worker is ready. Getting token...');
      
      const fcmToken = await getToken(messaging, {
        vapidKey: 'BAItmEyz8CteipahcahQYUl7kLviixkVk21CVUk6Jnt4cmIW4mQIVXAJru1nEwZCB3IpuMZc1AcQ0ZFW7myxMt0',
        serviceWorkerRegistration: registration
      });
      
      if (fcmToken) {
        console.log('FCM Token generated successfully (First 10 chars):', fcmToken.substring(0,10));
        
        // Save to backend
        // Assume 'app' for actual mobile apps, 'web' for web browsers. 
        // We will just pass 'web' by default since this is the web app.
        const platform = isMobile() ? 'app' : 'web'; 
        
        const endpoint = userType === 'retailer' 
          ? `${getBackendUrl()}/api/v1/notifications/retailer/token`
          : `${getBackendUrl()}/api/v1/notifications/delivery/token`;

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`
          },
          body: JSON.stringify({ token: fcmToken, platform })
        });
        
        const data = await res.json();
        if (data.success) {
           console.log(`Saved token for ${userType} on ${deviceType} successfully`);
        }
      }
    } else {
      console.log('Notification permission denied');
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
  }
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
