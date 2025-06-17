import { useState, useEffect } from 'react';

export function useExtensionConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkExtension = () => {
      setIsChecking(true);
      
      // Send message to extension
      window.postMessage({ type: 'BAAIJUS_WEB_PING' }, '*');
      
      // Listen for response
      const handleResponse = (event: MessageEvent) => {
        if (event.data?.type === 'BAAIJUS_EXTENSION_PONG') {
          setIsConnected(true);
          setIsChecking(false);
          window.removeEventListener('message', handleResponse);
        }
      };

      window.addEventListener('message', handleResponse);
      
      // Timeout after 2 seconds
      setTimeout(() => {
        setIsConnected(false);
        setIsChecking(false);
        window.removeEventListener('message', handleResponse);
      }, 2000);
    };

    checkExtension();
    
    // Check every 30 seconds
    const interval = setInterval(checkExtension, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { isConnected, isChecking };
}