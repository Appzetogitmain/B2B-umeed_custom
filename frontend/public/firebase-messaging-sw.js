importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

const firebaseConfig = {
  apiKey: "AIzaSyAPCl7G0Z1ONVfpaCcJW1of1FI6Dmmrj2M",
  authDomain: "umeed-7aeef.firebaseapp.com",
  projectId: "umeed-7aeef",
  storageBucket: "umeed-7aeef.firebasestorage.app",
  messagingSenderId: "781928903949",
  appId: "1:781928903949:web:fa1ceab948454cc9786c44",
  measurementId: "G-MRYB4HGRDN"
};

firebase.initializeApp(firebaseConfig);

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image || 'https://umeedretailers.com/assets/ur.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
