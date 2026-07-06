import { useEffect } from 'react';
import { onMessageListener } from '../utils/firebase';

export default function NotificationListener() {
  useEffect(() => {
    onMessageListener()
      .then((payload) => {
        console.log('Foreground notification received:', payload);
        
        if (Notification.permission === 'granted') {
          new Notification(payload.notification.title, {
            body: payload.notification.body,
            icon: payload.notification.image || '/assets/ur.png',
          });
        } else {
          alert(`${payload?.notification?.title}\n${payload?.notification?.body}`);
        }
      })
      .catch((err) => console.log('failed: ', err));
  }, []);

  return null;
}
