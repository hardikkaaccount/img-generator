'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import SubmissionsList from '../components/SubmissionsList';

// Define the API response interface
interface UserDataResponse {
  remainingPrompts: number;
  submittedPromptsCount: number;
  submissions?: {
    id: string;
    prompt: string;
    imageUrl: string;
  }[];
}

export default function Submissions() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState<number>(5);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    
    if (!storedUserId || !storedUsername) {
      router.push('/auth/login');
      return;
    }
    
    setUserId(storedUserId);
    setUsername(storedUsername);
    
    // Fetch the latest user data from the API
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserDataResponse>(`/api/user?userId=${storedUserId}`);
        setRemainingPrompts(response.data.remainingPrompts);
        console.log('Initial user data fetched:', response.data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  // Function to handle updates from the SubmissionsList component
  const handleStatsUpdate = (remaining: number) => {
    console.log('Stats updated from SubmissionsList:', remaining);
    setRemainingPrompts(remaining);
  };

  if (!userId || !username) {
    return (
      <main>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          Loading...
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar username={username} remainingPrompts={remainingPrompts} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Submissions</h1>
          
          <div className="bg-white p-6 rounded shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-2">Submission Overview</h2>
            <p className="text-gray-600">
              This page shows all the images you've generated, along with their status (Submitted or Deleted).
              Only images with the "Submitted" status will be considered as your final entries.
            </p>
          </div>
          
          {!isLoading && (
            <SubmissionsList userId={userId} onStatsUpdate={handleStatsUpdate} />
          )}
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push('/dashboard')}
              className="btn btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </main>
  );
} 