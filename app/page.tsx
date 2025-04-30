'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is logged in
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  return (
    <main className="min-h-screen">
      <Navbar username={username || undefined} />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-background bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Prompt Wars
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto">
              Unleash your creativity with AI-powered image generation
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-10">
              {!username ? (
                <>
                  <Link href="/auth/login" className="btn btn-primary text-lg px-8 py-3 w-full sm:w-auto">
                    Sign In
                  </Link>
                  <Link href="/auth/register" className="btn btn-secondary text-lg px-8 py-3 w-full sm:w-auto">
                    Create Account
                  </Link>
                </>
              ) : (
                <Link href="/dashboard" className="btn btn-primary text-lg px-10 py-4">
                  Open Dashboard
                </Link>
              )}
            </div>
            
            <Link href="/scoreboard" className="inline-flex items-center text-primary hover:text-accent gap-2 font-medium transition-colors duration-200">
              <span>View Leaderboard</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
            <div className="card group">
              <div className="h-2 bg-primary"></div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-3 text-primary">5 Unique Prompts</h2>
                <p className="text-gray-600">
                  Each participant gets 5 chances to generate AI images with their most creative prompts.
                </p>
              </div>
            </div>
            
            <div className="card group">
              <div className="h-2 bg-secondary"></div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-3 text-secondary">Submit Your Best</h2>
                <p className="text-gray-600">
                  For each prompt, you can either submit your generated image or delete it and try again with a new one.
                </p>
              </div>
            </div>
            
            <div className="card group">
              <div className="h-2 bg-accent"></div>
              <div className="p-6">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold mb-3 text-accent">Compete & Win</h2>
                <p className="text-gray-600">
                  Track your submissions on the leaderboard and compete with others for the most creative AI images.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-16 card p-8 animate-slide-up" style={{animationDelay: '0.2s'}}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
              <span className="bg-background text-white p-2 rounded-md mr-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </span>
              How It Works
            </h2>
            
            <ol className="space-y-6 text-gray-700 relative before:absolute before:left-3 before:top-2 before:h-[calc(100%-20px)] before:w-0.5 before:bg-gray-200">
              <li className="pl-10 relative">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">1</div>
                <h3 className="font-semibold text-lg mb-1 text-gray-800">Register or log in</h3>
                <p className="text-gray-600">Create an account or sign in to access the challenge platform.</p>
              </li>
              
              <li className="pl-10 relative">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">2</div>
                <h3 className="font-semibold text-lg mb-1 text-gray-800">Enter a prompt</h3>
                <p className="text-gray-600">Craft a detailed prompt to generate a unique AI image.</p>
              </li>
              
              <li className="pl-10 relative">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">3</div>
                <h3 className="font-semibold text-lg mb-1 text-gray-800">Review and decide</h3>
                <p className="text-gray-600">Review the generated image and decide whether to submit or delete it.</p>
              </li>
              
              <li className="pl-10 relative">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">4</div>
                <h3 className="font-semibold text-lg mb-1 text-gray-800">Use your prompts wisely</h3>
                <p className="text-gray-600">You have 5 prompts total. Choose carefully which images to submit!</p>
              </li>
              
              <li className="pl-10 relative">
                <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold">5</div>
                <h3 className="font-semibold text-lg mb-1 text-gray-800">Check the leaderboard</h3>
                <p className="text-gray-600">See your rank on the leaderboard compared to other participants.</p>
              </li>
            </ol>
            
            <div className="mt-8 text-center">
              {!username ? (
                <Link href="/auth/register" className="btn btn-primary px-8 py-3">
                  Get Started Now
                </Link>
              ) : (
                <Link href="/dashboard" className="btn btn-primary px-8 py-3">
                  Continue to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <footer className="mt-20 py-8 bg-background text-text-secondary">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} Prompt Wars. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
} 