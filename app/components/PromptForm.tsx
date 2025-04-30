'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

// Maximum allowed prompt length
const MAX_PROMPT_LENGTH = 500;

interface PromptFormProps {
  userId?: string;
  onSuccess?: (imageUrl: string, prompt: string) => void;
  onRemainingPromptsUpdate?: (remainingPrompts: number) => void;
  onSubmissionComplete?: () => void;
  onPromptUse?: () => void;
}

export default function PromptForm({ 
  userId,
  onSuccess,
  onRemainingPromptsUpdate,
  onSubmissionComplete, 
  onPromptUse 
}: PromptFormProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const router = useRouter();

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const input = e.target.value;
    // Limit the input to the maximum length
    if (input.length <= MAX_PROMPT_LENGTH) {
      setPrompt(input);
    } else {
      setPrompt(input.substring(0, MAX_PROMPT_LENGTH));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    setGeneratedImage(null); // Reset any previously generated image

    try {
      // For proper endpoint
      const endpoint = userId ? '/api/generate-image' : '/api/generate';
      console.log(`Submitting prompt to ${endpoint}: "${prompt}"`);
      
      const response = await axios.post(endpoint, { 
        prompt,
        userId 
      });
      
      const imageUrl = response.data.imageUrl;
      console.log('Image generated successfully');
      
      setGeneratedImage(imageUrl);
      
      if (onSuccess) {
        onSuccess(imageUrl, prompt);
      }
      
      if (onPromptUse) {
        onPromptUse();
      }
      
      // If we get remaining prompts info from the API
      if (onRemainingPromptsUpdate && response.data.remainingPrompts !== undefined) {
        onRemainingPromptsUpdate(response.data.remainingPrompts);
      }
    } catch (err: any) {
      console.error('Error generating image:', err);
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to generate image.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setPrompt('');
    setGeneratedImage(null);
    setError('');
  };

  return (
    <div className="card animate-fade-in overflow-hidden h-full flex flex-col shadow-lg border border-primary/10 rounded-xl bg-white">
      <div className="card-header bg-gradient-to-r from-primary/10 to-secondary/10 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-primary/20 text-primary">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-text">Create Your Masterpiece</h2>
            <p className="text-text-secondary mt-1">Craft a detailed prompt to generate your perfect image</p>
          </div>
        </div>
      </div>
      
      <div className="card-body flex-grow p-6">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-3">
              <label htmlFor="prompt" className="block text-base font-medium text-text flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
                Your Creative Prompt:
              </label>
              <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                prompt.length >= MAX_PROMPT_LENGTH * 0.9 
                  ? 'text-white bg-danger' 
                  : prompt.length >= MAX_PROMPT_LENGTH * 0.7
                  ? 'text-white bg-warning'
                  : 'text-white bg-primary/60'
              }`}>
                {prompt.length}/{MAX_PROMPT_LENGTH}
              </span>
            </div>
            
            <div className="relative">
              <textarea
                id="prompt"
                className="input h-full min-h-[220px] p-5 font-medium w-full text-lg border-2 border-primary/20 focus:border-primary/40 focus:ring-2 focus:ring-primary/20 transition-all rounded-xl"
                value={prompt}
                onChange={handlePromptChange}
                placeholder="Describe your image in vivid detail. What style, mood, colors, and composition do you envision?"
                required
                disabled={isLoading}
                maxLength={MAX_PROMPT_LENGTH}
              />
              
              {prompt.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
              )}
            </div>
            
            <div className="bg-primary/5 rounded-xl p-4 mt-4 text-sm text-text-secondary border border-primary/10">
              <div className="flex gap-2 items-start">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong className="text-primary font-semibold">Pro Tips:</strong>
                  <ul className="mt-1 ml-2 space-y-1 list-disc list-inside text-text-secondary">
                    <li>Include specific subjects and details (landscape, portrait, scene)</li>
                    <li>Specify art style (realistic, anime, oil painting, watercolor)</li>
                    <li>Mention lighting conditions and color palette</li>
                    <li>Describe mood and atmosphere (dreamy, dark, vibrant)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
              type="submit"
              disabled={isLoading || !prompt.trim()}
              className={`btn btn-primary py-3 text-base ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="ml-2">Generating Magic...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-2">Generate Image</span>
                </>
              )}
            </button>
            
            <button
              type="button"
              onClick={handleClear}
              className="btn btn-outline border-gray-300 py-3 text-base"
              disabled={isLoading || (!prompt && !generatedImage)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              <span className="ml-2">Clear</span>
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mt-6 rounded-xl bg-danger/10 border border-danger/20 p-4 text-danger flex items-center gap-3 animate-fade-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
          </div>
        )}
        
        {generatedImage && !onSuccess && (
          <div className="mt-8 animate-fade-in">
            <h3 className="text-xl font-semibold text-text mb-4">Generated Image:</h3>
            <div className="relative rounded-xl overflow-hidden shadow-md border border-gray-200">
              <img
                src={generatedImage}
                alt="Generated from prompt"
                className="w-full h-auto object-contain max-h-[600px]"
                loading="lazy"
                onError={(e) => {
                  console.error('Image failed to load');
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; // Prevent infinite loops
                  target.src = 'https://placehold.co/800x600/EF4444/FFFFFF?text=Error+Loading+Image';
                }}
              />
            </div>
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
              <h4 className="text-sm font-medium text-text-secondary mb-1">Your Prompt:</h4>
              <p className="text-text italic">"{prompt}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 