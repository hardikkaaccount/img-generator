'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '../components/Navbar';
import PromptForm from '../components/PromptForm';
import ImageActions from '../components/ImageActions';

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [remainingPrompts, setRemainingPrompts] = useState<number>(5);
  const [submittedCount, setSubmittedCount] = useState<number>(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [currentPrompt, setCurrentPrompt] = useState<string | null>(null);
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();

  // Function to reset the image state
  const resetImageState = () => {
    setGeneratedImage(null);
    setCurrentPrompt(null);
  };

  useEffect(() => {
    // Reset image state on component mount/reload
    resetImageState();
    
    // Check if user is logged in
    const storedUserId = localStorage.getItem('userId');
    const storedUsername = localStorage.getItem('username');
    
    if (!storedUserId || !storedUsername) {
      router.push('/auth/login');
      return;
    }
    
    setUserId(storedUserId);
    setUsername(storedUsername);
    
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/api/user?userId=${storedUserId}`);
        
        setRemainingPrompts(response.data.remainingPrompts);
        setSubmittedCount(response.data.submittedPromptsCount);
        
        // If user has submitted, show the game ended screen
        if (response.data.submittedPromptsCount > 0) {
          setGameEnded(true);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUserData();
  }, [router]);

  const handleImageGenerated = (imageUrl: string, prompt: string) => {
    setGeneratedImage(imageUrl);
    setCurrentPrompt(prompt);
  };

  const handleRemainingPromptsUpdate = (prompts: number) => {
    setRemainingPrompts(prompts);
  };

  const handleSubmissionComplete = () => {
    setGameEnded(true);
    setSubmittedCount(prev => prev + 1);
  };

  // Handle image deletion
  const handleImageDeleted = () => {
    resetImageState();
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </main>
    );
  }

  if (!userId || !username) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="card p-8 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-text mb-4">Sign In Required</h2>
            <p className="text-text-secondary mb-6">Please log in to access the dashboard.</p>
            <button
              onClick={() => router.push('/auth/login')}
              className="btn btn-primary"
            >
              Sign In
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar username={username} remainingPrompts={remainingPrompts} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-text">Prompt Wars Dashboard</h1>
              <p className="text-text-secondary mt-2">Create and submit your AI-generated masterpiece</p>
            </div>
            <div className="badge badge-primary text-base px-4 py-2 flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>{remainingPrompts} {remainingPrompts === 1 ? 'Prompt' : 'Prompts'} Remaining</span>
            </div>
          </div>
        </header>
        
        {gameEnded ? (
          <div className="card animate-fade-in overflow-hidden shadow-xl">
            <div className="card-header bg-gradient-to-r from-success/10 to-primary/10 p-6">
              <h2 className="text-2xl font-bold text-success">Success! Your Submission is Complete</h2>
              <p className="text-text-secondary mt-2">Thank you for participating in Prompt Wars</p>
            </div>
            
            <div className="card-body p-6">
              <div className="rounded-lg border border-success/20 bg-success/5 p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-success mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                
                <h3 className="text-2xl font-bold mb-4 text-text">Your Image Has Been Submitted!</h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  You've successfully completed the Prompt Wars challenge. You can now view your submission or check out how you rank against other participants.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    onClick={() => router.push('/submissions')}
                    className="btn btn-primary py-3 px-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-2">View My Submission</span>
                  </button>
                  <button
                    onClick={() => router.push('/scoreboard')}
                    className="btn btn-outline py-3 px-6"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    <span className="ml-2">View Leaderboard</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : remainingPrompts <= 0 ? (
          <div className="card animate-fade-in overflow-hidden shadow-xl">
            <div className="card-header bg-gradient-to-r from-warning/10 to-danger/10 p-6">
              <h2 className="text-2xl font-bold text-warning">No Prompts Remaining</h2>
              <p className="text-text-secondary mt-2">You've used all your available prompts</p>
            </div>
            
            <div className="card-body p-6">
              <div className="rounded-lg border border-warning/20 bg-warning/5 p-8 text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-warning mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                
                <h3 className="text-2xl font-bold mb-4 text-text">You've Used All Your Prompts!</h3>
                <p className="text-text-secondary mb-8 max-w-md mx-auto">
                  You can view your submissions to see the images you've generated.
                </p>
                
                <button
                  onClick={() => router.push('/submissions')}
                  className="btn btn-primary py-3 px-6"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2">View My Submissions</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="card overflow-hidden mb-8 shadow-lg border border-primary/10 rounded-xl bg-white">
              <div className="card-header bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/20 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-text">Prompt Generator</h2>
                      <p className="text-text-secondary mt-1">Create your AI-generated image masterpiece</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="card-body p-6">
                <div className="bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <div className="flex gap-3">
                    <div className="p-2 rounded-full bg-primary/10 text-primary">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-text-secondary">
                        Enter a detailed prompt to generate your AI image. You have <strong>{remainingPrompts}</strong> attempts remaining.
                      </p>
                      <p className="text-warning font-medium mt-2">
                        Important: Once you submit an image, your game will end. Choose wisely!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="order-1">
                <PromptForm
                  userId={userId}
                  onSuccess={handleImageGenerated}
                  onRemainingPromptsUpdate={handleRemainingPromptsUpdate}
                />
              </div>
              
              {generatedImage && currentPrompt ? (
                <div className="order-2">
                  <ImageActions
                    userId={userId}
                    prompt={currentPrompt}
                    imageUrl={generatedImage}
                    onRemainingPromptsUpdate={handleRemainingPromptsUpdate}
                    onSubmissionComplete={handleSubmissionComplete}
                    onImageDeleted={handleImageDeleted}
                  />
                </div>
              ) : (
                <div className="order-2 hidden lg:flex">
                  <div className="card h-full flex flex-col justify-center items-center bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-8 text-center">
                    <div className="p-6 rounded-full bg-gray-200/50 mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-500 mb-3">Your Generated Image Will Appear Here</h3>
                    <p className="text-gray-400 max-w-md">
                      Use the prompt generator on the left to create your AI masterpiece. Be creative and descriptive!
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
} 