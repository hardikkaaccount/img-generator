'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Navbar from '../components/Navbar';

interface SubmissionRanking {
  id: string;
  username: string;
  imageUrl: string;
  prompt: string;
  votes: number;
  rank: number;
}

// Define the API response interface
interface LeaderboardResponse {
  rankings: {
    id: string;
    username: string;
    imageUrl: string;
    prompt: string;
    votes: number;
    rank: number;
  }[];
}

export default function Leaderboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [rankings, setRankings] = useState<SubmissionRanking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    
    if (storedUserId && storedUsername) {
      setUserId(storedUserId);
      setUsername(storedUsername);
    }
    
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get<LeaderboardResponse>('/api/leaderboard');
        setRankings(response.data.rankings);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setError('Failed to load leaderboard');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [router]);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar username={username || undefined} />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar username={username || undefined} />
        <div className="container mx-auto px-4 py-16">
          <div className="card p-8 max-w-md mx-auto">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-danger mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h2 className="text-2xl font-bold text-text mb-4">Error Loading Leaderboard</h2>
              <p className="text-text-secondary mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar username={username || undefined} />
      
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-text">Leaderboard</h1>
              <p className="text-text-secondary mt-2">Current top-ranked submissions based on votes</p>
            </div>
            <div className="mt-4 md:mt-0">
              <button
                onClick={() => router.push('/dashboard')}
                className="btn btn-outline btn-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 15.707a1 1 0 010-1.414L14.586 10l-4.293-4.293a1 1 0 111.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>Create Submission</span>
              </button>
            </div>
          </div>
        </header>
        
        {rankings.length === 0 ? (
          <div className="card animate-fade-in overflow-hidden">
            <div className="card-header bg-gradient-to-r from-secondary/10 to-primary/10">
              <h2 className="text-2xl font-bold text-text">No Submissions Yet</h2>
              <p className="text-text-secondary mt-2">Be the first to submit an image and take the top spot!</p>
            </div>
            
            <div className="card-body">
              <div className="rounded-lg border border-border bg-card/50 p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-text-secondary mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <h3 className="text-xl font-bold mb-4 text-text">Leaderboard is Empty</h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  No submissions have been made yet. Be the first to create and submit an image to claim the #1 spot!
                </p>
                
                <button
                  onClick={() => router.push('/dashboard')}
                  className="btn btn-primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  <span>Create New Image</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Top 3 Podium */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {rankings.slice(0, 3).map((submission, index) => {
                const position = index + 1;
                let positionClass = "";
                let medal = "";
                
                switch (position) {
                  case 1:
                    positionClass = "order-2 md:order-2 border-yellow-400 shadow-yellow-400/20";
                    medal = "🥇";
                    break;
                  case 2:
                    positionClass = "order-1 md:order-1 border-gray-400 shadow-gray-400/20";
                    medal = "🥈";
                    break;
                  case 3:
                    positionClass = "order-3 md:order-3 border-amber-700 shadow-amber-700/20"; 
                    medal = "🥉";
                    break;
                }
                
                return (
                  <div 
                    key={submission.id} 
                    className={`card hover:shadow-md transition-all duration-300 border-2 ${positionClass}`}
                  >
                    <div className="card-header bg-gradient-to-r from-primary/10 to-secondary/10 relative">
                      <div className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-card border-2 border-primary flex items-center justify-center text-xl font-bold">
                        {medal}
                      </div>
                      <h2 className="text-lg font-bold text-text line-clamp-1">
                        {submission.username}
                      </h2>
                      <div className="text-primary font-semibold flex items-center gap-2 mt-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                        </svg>
                        <span>{submission.votes} Votes</span>
                      </div>
                    </div>
                    
                    <div className="card-body p-0">
                      <div className="relative aspect-square w-full overflow-hidden">
                        <Image 
                          src={submission.imageUrl} 
                          alt={submission.prompt} 
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          className="object-cover transition-all duration-500 hover:scale-105"
                        />
                      </div>
                    </div>
                    
                    <div className="card-footer p-4 bg-card/50">
                      <div className="line-clamp-2 text-sm text-text-secondary">
                        {submission.prompt}
                      </div>
                      <button 
                        className="btn btn-sm btn-primary w-full mt-4"
                        onClick={() => router.push(`/submission/${submission.id}`)}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* Rest of the rankings */}
            <div className="card overflow-hidden">
              <div className="card-header bg-gradient-to-r from-primary/5 to-secondary/5">
                <h2 className="text-xl font-bold text-text">All Rankings</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-card/50">
                    <tr>
                      <th className="p-4 text-left font-semibold text-text-secondary">Rank</th>
                      <th className="p-4 text-left font-semibold text-text-secondary">User</th>
                      <th className="p-4 text-left font-semibold text-text-secondary">Preview</th>
                      <th className="p-4 text-left font-semibold text-text-secondary">Prompt</th>
                      <th className="p-4 text-left font-semibold text-text-secondary">Votes</th>
                      <th className="p-4 text-left font-semibold text-text-secondary">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {rankings.map((submission) => (
                      <tr key={submission.id} className="hover:bg-card/30 transition-colors">
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                            {submission.rank}
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap font-medium">{submission.username}</td>
                        <td className="p-4">
                          <div className="relative w-12 h-12 rounded-md overflow-hidden">
                            <Image 
                              src={submission.imageUrl} 
                              alt={submission.prompt}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                        </td>
                        <td className="p-4 max-w-[200px]">
                          <div className="line-clamp-2 text-sm">{submission.prompt}</div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <div className="flex items-center text-primary font-medium gap-1">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                            </svg>
                            {submission.votes}
                          </div>
                        </td>
                        <td className="p-4 whitespace-nowrap">
                          <button 
                            className="btn btn-sm btn-outline"
                            onClick={() => router.push(`/submission/${submission.id}`)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                            <span>View</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 