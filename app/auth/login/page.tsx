'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '../../components/Navbar';

// Define the response type
interface LoginResponse {
  user: {
    id: string;
    username: string;
  };
  message: string;
}

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset error
    setError('');
    console.log('Login attempt for:', username);
    
    // Validate form
    if (!username || !password) {
      setError('Username and password are required');
      console.log('Login form validation failed: Missing fields');
      return;
    }
    
    setIsLoading(true);
    
    try {
      console.log('Sending login request to API...');
      const response = await axios.post<LoginResponse>('/api/auth/login', {
        username,
        password
      });
      
      console.log('Login successful, response:', response.data);
      
      try {
        // Store user data in localStorage
        if (typeof window !== 'undefined') {
          console.log('Setting localStorage values...');
          console.log('User ID:', response.data.user.id);
          console.log('Username:', response.data.user.username);
          localStorage.setItem('userId', response.data.user.id);
          localStorage.setItem('username', response.data.user.username);
          console.log('User data stored in localStorage');
        } else {
          console.warn('Window object not available for localStorage');
        }
      } catch (storageError) {
        console.error('Error storing data in localStorage:', storageError);
        // Continue anyway, as this might be a browser security setting
      }
      
      // Redirect to dashboard
      console.log('Redirecting to dashboard...');
      setTimeout(() => {
        router.push('/dashboard');
      }, 500); // Short delay to ensure localStorage is set before redirect
    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setError(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto bg-white p-8 rounded shadow-md">
          <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="input w-full"
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input w-full"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link href="/auth/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 