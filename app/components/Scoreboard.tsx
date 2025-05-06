'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

interface User {
  id: string;
  username: string;
  submittedPromptsCount: number;
  updatedAt: string;
}

// Define the API response interface
interface ScoreboardResponse {
  users: {
    id: string;
    username: string;
    submittedPromptsCount: number;
    updatedAt: string;
    avatar?: string;
  }[];
}

export default function Scoreboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchScoreboard = async () => {
      try {
        const response = await axios.get<ScoreboardResponse>('/api/scoreboard');
        setUsers(response.data.users);
        setIsLoading(false);
      } catch (error: any) {
        console.error('Error fetching scoreboard:', error);
        setError(error.response?.data?.message || 'Failed to fetch scoreboard');
        setIsLoading(false);
      }
    };

    fetchScoreboard();
  }, []);

  if (isLoading) {
    return (
      <div className="card p-8 text-center animate-pulse">
        <div className="h-10 bg-gray-200 rounded-md mb-6 mx-auto max-w-xs"></div>
        <div className="h-6 bg-gray-200 rounded-md mb-4 w-2/3 mx-auto"></div>
        <div className="h-6 bg-gray-200 rounded-md mb-4 w-3/4 mx-auto"></div>
        <div className="h-6 bg-gray-200 rounded-md w-1/2 mx-auto"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 text-center">
        <div className="text-red-500 flex items-center justify-center gap-2 mb-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-semibold">Error</span>
        </div>
        <p className="text-gray-600">{error}</p>
      </div>
    );
  }

  // Sort users by submission count (highest first) and then by timestamp (earliest first)
  const sortedUsers = [...users].sort((a, b) => {
    if (b.submittedPromptsCount !== a.submittedPromptsCount) {
      return b.submittedPromptsCount - a.submittedPromptsCount;
    }
    // If submission counts are equal, sort by timestamp
    return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
  });

  return (
    <div className="card animate-fade-in">
      <div className="card-header flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Leaderboard</h2>
        <div className="bg-accent text-white px-3 py-1 rounded-full text-sm font-medium">
          {sortedUsers.length} Participant{sortedUsers.length !== 1 ? 's' : ''}
        </div>
      </div>
      
      {sortedUsers.length === 0 ? (
        <div className="card-body text-center py-10">
          <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-lg text-gray-600 mb-2">No submissions yet</p>
          <p className="text-gray-500">Be the first to submit your AI-generated image!</p>
        </div>
      ) : (
        <div className="card-body p-0">
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Rank</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Username</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Submissions</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700 hidden sm:table-cell">Last Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedUsers.map((user, index) => (
                  <tr 
                    key={user.id} 
                    className={`hover:bg-gray-50 transition-colors duration-150 ${index < 3 ? 'animate-slide-up' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index === 0 ? (
                        <div className="flex items-center">
                          <span className="flex items-center justify-center w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full font-bold">1</span>
                          <span className="ml-2 text-yellow-500">🏆</span>
                        </div>
                      ) : index === 1 ? (
                        <div className="flex items-center">
                          <span className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-full font-bold">2</span>
                          <span className="ml-2 text-gray-400">🥈</span>
                        </div>
                      ) : index === 2 ? (
                        <div className="flex items-center">
                          <span className="flex items-center justify-center w-8 h-8 bg-amber-100 text-amber-600 rounded-full font-bold">3</span>
                          <span className="ml-2 text-amber-600">🥉</span>
                        </div>
                      ) : (
                        <span className="flex items-center justify-center w-8 h-8 bg-gray-50 text-gray-600 rounded-full font-medium">
                          {index + 1}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">
                      {user.username}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="bg-primary/10 text-primary px-2 py-1 rounded-full text-sm font-medium">
                          {user.submittedPromptsCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500 hidden sm:table-cell">
                      {new Date(user.updatedAt).toLocaleDateString()} at {new Date(user.updatedAt).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
} 