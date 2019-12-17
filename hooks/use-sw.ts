import React from 'react';

const useServiceWorker = () => {
  React.useEffect(() => {
    const sw = async () => {
      if (
        process.env.NODE_ENV === 'production' &&
        'serviceWorker' in navigator
      ) {
        try {
          await navigator.serviceWorker.register('/sw.js');
        } catch (error) {
          console.warn('Service Worker failed to register');
        }
      }
    };
    sw();
  }, []);
};

export { useServiceWorker };
