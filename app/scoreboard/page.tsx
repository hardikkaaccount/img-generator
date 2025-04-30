'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/Navbar';
import Scoreboard from '../components/Scoreboard';

export default function ScoreboardPage() {
  const [username, setUsername] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <main>
      <Navbar username={username || undefined} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Prompt Wars Leaderboard</h1>
          
          <div className="mb-6 bg-white p-6 rounded shadow-md">
            <h2 className="text-xl font-semibold mb-4">Challenge Info</h2>
            <p className="text-gray-700 mb-3">
              This leaderboard shows participants who have submitted their generated images. 
              Rankings are based on the number of submissions, with earlier submissions ranked higher in case of ties.
            </p>
            <p className="text-gray-700">
              Each participant gets 5 prompts. Once a participant submits an image, it counts towards their score.
              Deleted images don't count.
            </p>
          </div>
          
          <Scoreboard />
          
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => router.push('/')}
              className="btn btn-primary mr-4"
            >
              Return to Home
            </button>
            
            {username && (
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-secondary"
              >
                Go to Dashboard
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 