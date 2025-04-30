'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Navbar from '../components/Navbar';

interface User {
  id: string;
  username: string;
  submittedPromptsCount: number;
}

interface Submission {
  id: string;
  prompt: string;
  imageUrl: string;
  status: 'Submitted' | 'Deleted';
  timestamp: string;
  userId: string;
  username?: string;
}

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  // In a real application, you would implement proper authentication here
  // This is just a placeholder for demonstration purposes
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    
    if (!isAdmin) {
      router.push('/');
      return;
    }
    
    // Fetch users and submissions data
    // This is a mock implementation as we don't have admin API endpoints yet
    const fetchData = async () => {
      try {
        // In a real application, you would make API calls to fetch this data
        setUsers([
          { id: '1', username: 'user1', submittedPromptsCount: 3 },
          { id: '2', username: 'user2', submittedPromptsCount: 5 },
          { id: '3', username: 'user3', submittedPromptsCount: 0 }
        ]);
        
        setSubmissions([
          {
            id: '1',
            prompt: 'A beautiful sunset over the ocean',
            imageUrl: 'https://placekitten.com/800/600',
            status: 'Submitted',
            timestamp: new Date().toISOString(),
            userId: '1',
            username: 'user1'
          },
          {
            id: '2',
            prompt: 'A futuristic city with flying cars',
            imageUrl: 'https://placekitten.com/801/600',
            status: 'Submitted',
            timestamp: new Date().toISOString(),
            userId: '1',
            username: 'user1'
          }
        ]);
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to fetch data');
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [router]);

  if (isLoading) {
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
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Users</h2>
            
            {users.length === 0 ? (
              <p>No users found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="py-2 px-4 text-left">Username</th>
                      <th className="py-2 px-4 text-left">Submitted</th>
                      <th className="py-2 px-4 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.id} className="border-b">
                        <td className="py-2 px-4">{user.username}</td>
                        <td className="py-2 px-4">{user.submittedPromptsCount}</td>
                        <td className="py-2 px-4">
                          <button className="text-primary hover:underline">
                            View Submissions
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-2xl font-semibold mb-4">Recent Submissions</h2>
            
            {submissions.length === 0 ? (
              <p>No submissions found.</p>
            ) : (
              <div className="space-y-6">
                {submissions.map((submission) => (
                  <div key={submission.id} className="border-b pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{submission.username}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(submission.timestamp).toLocaleString()}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs ${
                        submission.status === 'Submitted'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {submission.status}
                      </div>
                    </div>
                    
                    <p className="my-2">{submission.prompt}</p>
                    
                    <div className="relative h-40 w-full">
                      <Image
                        src={submission.imageUrl}
                        alt={submission.prompt}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
} 