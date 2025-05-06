'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import Image from 'next/image';

interface Submission {
  id: string;
  prompt: string;
  imageUrl: string;
  status: 'Submitted' | 'Deleted';
  timestamp: string;
}

interface SubmissionsListProps {
  userId: string;
  onStatsUpdate?: (remainingPrompts: number) => void;
}

// Define the API response interface
interface SubmissionsResponse {
  message?: string;
  submissions: {
    id: string;
    prompt: string;
    imageUrl: string;
    createdAt?: string;
    status?: 'Submitted' | 'Deleted';
    timestamp?: string;
  }[];
  remainingPrompts: number;
  submittedPromptsCount: number;
}

export default function SubmissionsList({ userId, onStatsUpdate }: SubmissionsListProps) {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [remainingPrompts, setRemainingPrompts] = useState(0);
  const [submittedCount, setSubmittedCount] = useState(0);

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        const response = await axios.get<SubmissionsResponse>(`/api/submissions/get?userId=${userId}`);
        // Convert API response to match Submission type
        const formattedSubmissions: Submission[] = response.data.submissions.map(sub => ({
          id: sub.id,
          prompt: sub.prompt,
          imageUrl: sub.imageUrl,
          status: sub.status || 'Submitted',
          timestamp: sub.timestamp || sub.createdAt || new Date().toISOString()
        }));
        setSubmissions(formattedSubmissions);
        setRemainingPrompts(response.data.remainingPrompts || 0);
        setSubmittedCount(response.data.submittedPromptsCount || 0);
      } catch (error: any) {
        console.error('Error fetching submissions:', error);
        setError(error.response?.data?.message || 'Failed to fetch submissions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [userId]);

  if (isLoading) {
    return <div className="text-center py-12">Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-12">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded shadow-md">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-medium">Remaining Prompts:</span>{' '}
            <span className="text-primary">{remainingPrompts}</span>
          </div>
          <div>
            <span className="font-medium">Submitted:</span>{' '}
            <span className="text-secondary">{submittedCount}</span>
          </div>
        </div>
      </div>
      
      {submissions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded shadow-md">
          <p className="text-lg">You haven't generated any images yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {submissions.map((submission) => (
            <div 
              key={submission.id} 
              className={`bg-white p-4 rounded shadow-md ${
                submission.status === 'Deleted' ? 'opacity-75' : ''
              }`}
            >
              <div className="relative h-48 w-full mb-4">
                <Image
                  src={submission.imageUrl}
                  alt={submission.prompt}
                  fill
                  className="object-contain rounded"
                />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Prompt:</h3>
                <p className="text-gray-700">{submission.prompt}</p>
                
                <div className="flex justify-between items-center mt-4">
                  <div className={`px-3 py-1 rounded text-sm ${
                    submission.status === 'Submitted'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {submission.status}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    {new Date(submission.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 