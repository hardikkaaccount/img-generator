'use client';

import { useEffect } from 'react';
import axios from 'axios';

interface TabTrackerProps {
  userId: string;
}

export default function TabTracker({ userId }: TabTrackerProps) {
  useEffect(() => {
    if (!userId) return;

    // Function to call API and increment tab switch count
    const trackTabSwitch = async () => {
      try {
        await axios.post('/api/user/tabswitch', { userId });
        console.log('Tab switch recorded');
      } catch (error) {
        console.error('Error recording tab switch:', error);
      }
    };

    // Track tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        trackTabSwitch();
      }
    };

    // Set up event listeners for tab switching
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup function
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userId]);

  // This component doesn't render anything visible
  return null;
} 