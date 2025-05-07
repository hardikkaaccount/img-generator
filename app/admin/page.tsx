'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import { FaDownload, FaSearch, FaSpinner, FaArrowLeft, FaArrowRight } from 'react-icons/fa';

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

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

// The admin key for authentication
const ADMIN_KEY = 'admin-hardik-secret-key'; // This should be the same as in your API

export default function Admin() {
  const [users, setUsers] = useState<User[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [totalSubmissions, setTotalSubmissions] = useState(0);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  });
  const router = useRouter();

  // Check if admin key is provided and authenticate
  useEffect(() => {
    const storedAdminKey = localStorage.getItem('adminKey');
    if (storedAdminKey) {
      setAdminKey(storedAdminKey);
      setIsAuthenticated(storedAdminKey === ADMIN_KEY);
    }
  }, []);

  // Fetch data when authenticated or when page changes
  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, pagination.page]);

  // Filter submissions based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSubmissions(submissions);
    } else {
      const term = searchTerm.toLowerCase();
      setFilteredSubmissions(
        submissions.filter(
          sub =>
            sub.prompt.toLowerCase().includes(term) ||
            sub.username?.toLowerCase().includes(term)
        )
      );
    }
  }, [searchTerm, submissions]);

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      // Fetch users from the scoreboard API
      console.log('Fetching users from scoreboard API...');
      const usersResponse = await axios.get('/api/scoreboard');
      setUsers((usersResponse.data as any).users || []);

      // Fetch submissions from the admin API with pagination
      console.log(`Fetching submissions page ${pagination.page}...`);
      const submissionsResponse = await axios.get(
        `/api/admin/submissions?adminKey=${adminKey}&page=${pagination.page}&limit=${pagination.limit}`
      );
      console.log('Submissions API response received');
      const submissionsData = submissionsResponse.data as { 
        submissions: Submission[],
        totalCount: number,
        pagination: Pagination 
      };
      
      setSubmissions(submissionsData.submissions || []);
      setFilteredSubmissions(submissionsData.submissions || []);
      setTotalSubmissions(submissionsData.totalCount);
      setPagination(submissionsData.pagination);
      
      console.log(`Loaded ${submissionsData.submissions?.length || 0} submissions (page ${pagination.page} of ${submissionsData.pagination.pages})`);
      
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      let errorMessage = 'Failed to fetch data';
      
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response data:', error.response.data);
        console.error('Error response status:', error.response.status);
        
        errorMessage = `Server error (${error.response.status}): ${error.response.data?.message || error.message}`;
        
        // If unauthorized, clear admin key
        if (error.response.status === 401) {
          localStorage.removeItem('adminKey');
          setIsAuthenticated(false);
        }
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server - check your network connection';
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', error.message);
        errorMessage = `Request error: ${error.message}`;
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleLogin = () => {
    if (adminKey === ADMIN_KEY) {
      localStorage.setItem('adminKey', adminKey);
      setIsAuthenticated(true);
    } else {
      setError('Invalid admin key');
    }
  };

  // Download a submission image
  const handleDownload = (imageUrl: string, prompt: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `${prompt.substring(0, 20).replace(/[^a-z0-9]/gi, '_')}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Pagination handlers
  const handlePrevPage = () => {
    if (pagination.page > 1) {
      setPagination({
        ...pagination,
        page: pagination.page - 1
      });
    }
  };

  const handleNextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination({
        ...pagination,
        page: pagination.page + 1
      });
    }
  };

  // Login form
  if (!isAuthenticated) {
    return (
      <main>
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-6 text-center">Admin Login</h1>
            
            <div className="space-y-4">
              <div>
                <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-1">
                  Admin Key
                </label>
                <input
                  id="adminKey"
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  className="input w-full"
                  placeholder="Enter admin key"
                />
              </div>
              
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              
              <button
                onClick={handleLogin}
                className="btn btn-primary w-full"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main>
        <Navbar />
        <div className="container mx-auto px-4 py-12 text-center">
          <FaSpinner className="animate-spin h-10 w-10 mx-auto text-primary" />
          <p className="mt-4">Loading admin data...</p>
        </div>
      </main>
    );
  }

  return (
    <main>
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="bg-white p-6 rounded shadow-md mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <h2 className="text-2xl font-semibold">Active Submissions ({totalSubmissions})</h2>
            
            <div className="relative w-full md:w-64">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search prompts or users..."
                className="input w-full pr-10"
              />
              <FaSearch className="absolute right-3 top-3 text-gray-400" />
            </div>
          </div>
          
          {error && (
            <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
              {error}
            </div>
          )}
          
          {filteredSubmissions.length === 0 ? (
            <p>No submissions found.</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSubmissions.map((submission) => (
                  <div key={submission.id} className="border rounded-lg overflow-hidden bg-white shadow-sm">
                    <div className="p-4 border-b">
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
                    </div>
                    
                    <div className="relative h-64 w-full">
                      <Image
                        src={submission.imageUrl}
                        alt={submission.prompt}
                        fill
                        className="object-contain"
                      />
                    </div>
                    
                    <div className="p-4">
                      <p className="text-sm text-gray-700 mb-3 line-clamp-3">
                        {submission.prompt}
                      </p>
                      
                      <button
                        onClick={() => handleDownload(submission.imageUrl, submission.prompt)}
                        className="btn btn-sm btn-outline flex items-center gap-2"
                      >
                        <FaDownload className="h-4 w-4" />
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex items-center justify-between mt-8 border-t pt-6">
                  <div className="text-sm text-gray-700">
                    Showing page {pagination.page} of {pagination.pages}
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handlePrevPage}
                      disabled={pagination.page <= 1}
                      className={`btn btn-sm ${pagination.page <= 1 ? 'btn-disabled' : 'btn-outline'}`}
                    >
                      <FaArrowLeft className="mr-1" /> Previous
                    </button>
                    <button 
                      onClick={handleNextPage}
                      disabled={pagination.page >= pagination.pages}
                      className={`btn btn-sm ${pagination.page >= pagination.pages ? 'btn-disabled' : 'btn-outline'}`}
                    >
                      Next <FaArrowRight className="ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
} 