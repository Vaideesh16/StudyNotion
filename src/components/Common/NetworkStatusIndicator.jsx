import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

const NetworkStatusIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showOfflineMessage, setShowOfflineMessage] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowOfflineMessage(false);
      toast.success('Connection restored');
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowOfflineMessage(true);
      toast.error('Connection lost. Please check your internet connection.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Test server connectivity on mount
    const testServerConnection = async () => {
      try {
        const response = await fetch(process.env.REACT_APP_BASE_URL?.replace('/api/v1', '') || 'http://localhost:4000', {
          method: 'GET',
          mode: 'cors',
        });
        if (!response.ok) {
          toast.error('Server is not responding. Please ensure the server is running.');
        }
      } catch (error) {
        console.error('Server connectivity test failed:', error);
        toast.error('Unable to connect to server. Please ensure the server is running on the correct port.');
      }
    };

    if (navigator.onLine) {
      testServerConnection();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isOnline && showOfflineMessage) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-red-600 text-white p-2 text-center z-50">
        <p>No internet connection. Please check your network.</p>
      </div>
    );
  }

  return null;
};

export default NetworkStatusIndicator;
