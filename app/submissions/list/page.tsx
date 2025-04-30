'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Navbar from '@/app/components/Navbar';
import { FaSort, FaSortUp, FaSortDown, FaSpinner, FaUser, FaTrophy } from 'react-icons/fa';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface User {
  id: string;
  username: string;
  submittedPromptsCount: number;
  updatedAt: string;
  avatar?: string;
}

export default function SubmissionsList() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'username' | 'submittedPromptsCount' | 'updatedAt'>('submittedPromptsCount');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const fetchSubmissions = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching submissions from /api/scoreboard...');
      const response = await axios.get('/api/scoreboard');
      
      console.log('API response received:', response.status);
      console.log('Response data:', JSON.stringify(response.data));
      
      if (response.data && response.data.users) {
        console.log(`Found ${response.data.users.length} users in response`);
        setUsers(response.data.users);
      } else {
        console.error('Unexpected response format:', response.data);
        setError('Unexpected response format');
      }
    } catch (err) {
      console.error('Error fetching submissions:', err);
      // More detailed error logging
      if (axios.isAxiosError(err)) {
        console.error('Axios error details:', {
          status: err.response?.status,
          statusText: err.response?.statusText,
          data: err.response?.data,
        });
      }
      setError('Failed to fetch submissions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleSort = (criteria: 'username' | 'submittedPromptsCount' | 'updatedAt') => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(criteria);
      setSortDirection(criteria === 'username' ? 'asc' : 'desc');
    }
  };

  const sortedUsers = [...users].sort((a, b) => {
    if (sortBy === 'username') {
      return sortDirection === 'asc'
        ? a.username.localeCompare(b.username)
        : b.username.localeCompare(a.username);
    } else if (sortBy === 'submittedPromptsCount') {
      return sortDirection === 'asc'
        ? a.submittedPromptsCount - b.submittedPromptsCount
        : b.submittedPromptsCount - a.submittedPromptsCount;
    } else {
      return sortDirection === 'asc'
        ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    }
  });

  const getSortIcon = (column: 'username' | 'submittedPromptsCount' | 'updatedAt') => {
    if (sortBy !== column) return <FaSort className="ml-1 text-gray-400" />;
    return sortDirection === 'asc' ? <FaSortUp className="ml-1 text-primary" /> : <FaSortDown className="ml-1 text-primary" />;
  };

  // Function to get user initials for avatar fallback
  const getUserInitials = (username: string) => {
    return username.substring(0, 2).toUpperCase();
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <Navbar username={username || undefined} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Submissions Leaderboard</h1>
            <div className="flex gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
              >
                My Dashboard
              </button>
              <button
                onClick={() => router.push('/dashboard')}
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                Submit Prompt
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold mb-2">Leaderboard Rankings</h2>
              <p className="text-gray-600">
                This leaderboard shows all participants who have submitted prompts. Rankings are based on submission count, with earlier submissions ranked higher in case of ties.
              </p>
            </div>

            {loading ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <FaSpinner className="text-4xl text-primary animate-spin mb-4" />
                <p className="text-gray-500">Loading submissions data...</p>
              </div>
            ) : error ? (
              <div className="p-12 flex flex-col items-center justify-center">
                <div className="bg-red-50 text-red-500 p-4 rounded-md mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{error}</span>
                </div>
                <button
                  onClick={fetchSubmissions}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div>
                <div className="p-4 border-b bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    <span className="font-medium text-gray-800">{sortedUsers.length}</span> participants found
                  </div>
                  <div className="text-sm flex gap-2">
                    <span className="text-gray-500">Sort by:</span>
                    <button
                      onClick={() => handleSort('submittedPromptsCount')}
                      className={`font-medium flex items-center ${sortBy === 'submittedPromptsCount' ? 'text-primary' : 'text-gray-700'}`}
                    >
                      Submissions {getSortIcon('submittedPromptsCount')}
                    </button>
                  </div>
                </div>

                {sortedUsers.length === 0 ? (
                  <div className="p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <FaUser className="text-gray-400 text-2xl" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-800 mb-2">No submissions yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to submit your prompt and join the leaderboard!</p>
                    <button
                      onClick={() => router.push('/submissions')}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Submit a Prompt
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                            Rank
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('username')}
                          >
                            <div className="flex items-center">
                              Username {getSortIcon('username')}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                            onClick={() => handleSort('submittedPromptsCount')}
                          >
                            <div className="flex items-center">
                              Prompts Submitted {getSortIcon('submittedPromptsCount')}
                            </div>
                          </th>
                          <th 
                            scope="col" 
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hidden md:table-cell"
                            onClick={() => handleSort('updatedAt')}
                          >
                            <div className="flex items-center">
                              Last Activity {getSortIcon('updatedAt')}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {sortedUsers.map((user, index) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              {index === 0 ? (
                                <div className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full">
                                  <FaTrophy className="text-yellow-500" />
                                </div>
                              ) : index === 1 ? (
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full">
                                  <span className="font-bold">2</span>
                                </div>
                              ) : index === 2 ? (
                                <div className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-600 rounded-full">
                                  <span className="font-bold">3</span>
                                </div>
                              ) : (
                                <div className="flex items-center justify-center w-8 h-8 bg-gray-50 text-gray-600 rounded-full">
                                  <span>{index + 1}</span>
                                </div>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Avatar className="h-10 w-10 mr-3">
                                  {user.avatar ? (
                                    <AvatarImage src={user.avatar} alt={user.username} />
                                  ) : (
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                      {getUserInitials(user.username)}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="font-medium text-gray-900">{user.username}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1 inline-flex text-sm leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                                {user.submittedPromptsCount}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden md:table-cell">
                              {new Date(user.updatedAt).toLocaleDateString()} at {new Date(user.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => router.push('/')}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
            >
              Return to Home
            </button>
            {username && (
              <button
                onClick={() => router.push('/submissions/my')}
                className="px-4 py-2 bg-secondary text-white rounded-md hover:bg-secondary/90 transition-colors"
              >
                View My Submissions
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 