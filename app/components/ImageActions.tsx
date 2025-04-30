'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface ImageActionsProps {
  userId: string;
  prompt: string;
  imageUrl: string;
  onRemainingPromptsUpdate: (remainingPrompts: number) => void;
  onSubmissionComplete?: () => void;
  onImageDeleted?: () => void;
}

export default function ImageActions({
  userId,
  prompt,
  imageUrl,
  onRemainingPromptsUpdate,
  onSubmissionComplete,
  onImageDeleted
}: ImageActionsProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const router = useRouter();

  const initiateSubmit = () => {
    // Show the custom confirmation modal
    setShowConfirmModal(true);
  };

  const confirmSubmit = async () => {
    // Close the modal
    setShowConfirmModal(false);
    
    // Continue with submission
    setIsSubmitting(true);
    setError('');
    setSuccess('');
    
    try {
      console.log(`Submitting image with prompt: "${prompt}"`);
      
      const response = await axios.post('/api/submissions/submit', {
        userId,
        prompt,
        imageUrl
      });
      
      setSuccess('Image successfully submitted!');
      onRemainingPromptsUpdate(response.data.remainingPrompts);
      
      // Wait for a moment to show the success message
      setTimeout(() => {
        // Call the submission complete callback if provided
        if (onSubmissionComplete) {
          onSubmissionComplete();
        } else {
          // If no callback is provided, redirect to submissions page
          router.push('/submissions');
        }
      }, 1000);
    } catch (error: any) {
      console.error('Error submitting image:', error);
      setError(error.response?.data?.message || 'Failed to submit image');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    // Confirm deletion
    if (!confirm('Are you sure you want to delete this image? You will lose this prompt.')) {
      return;
    }
    
    setIsDeleting(true);
    setError('');
    setSuccess('');
    
    try {
      console.log(`Deleting image with prompt: "${prompt}"`);
      
      const response = await axios.post('/api/submissions/delete', {
        userId,
        prompt,
        imageUrl
      });
      
      setSuccess('Image deleted. Prepare to generate a new image...');
      onRemainingPromptsUpdate(response.data.remainingPrompts);
      
      // Wait for a moment to show the success message
      setTimeout(() => {
        // Call the image deleted callback if provided
        if (onImageDeleted) {
          onImageDeleted();
        }
        setSuccess('');
        setError('');
      }, 1000);
    } catch (error: any) {
      console.error('Error deleting image:', error);
      setError(error.response?.data?.message || 'Failed to delete image');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6 shadow-xl transform animate-slide-up">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-100 dark:text-white">Confirm Final Submission</h3>
            </div>
            
            <div className="mb-6 text-gray-600 dark:text-gray-300">
              <p className="mb-3 text-center font-medium">
                This action is <span className="text-warning">permanent</span> and cannot be undone.
              </p>
              <div className="bg-warning/10 p-4 rounded-lg border border-warning/20 mb-4">
                <p className="text-sm">
                  Once submitted, this image will be your final submission and cannot be changed. Are you sure you want to proceed?
                </p>
              </div>
            </div>
            
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="btn btn-outline px-5"
              >
                Cancel
              </button>
              <button
                onClick={confirmSubmit}
                className="btn btn-primary px-5"
              >
                Yes, Submit Image
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="card animate-fade-in overflow-hidden h-full flex flex-col">
        <div className="card-header bg-gradient-to-r from-primary/5 to-secondary/5">
          <h2 className="text-2xl font-bold text-text">Your Generated Image</h2>
          <p className="text-text-secondary mt-2">Review and decide what to do with your creation</p>
        </div>
        
        <div className="card-body flex-grow flex flex-col">
          {/* Display the generated image */}
          <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-gray-50 mb-4 flex-grow">
            <div className="relative w-full h-full min-h-[250px] flex items-center justify-center">
              <img
                src={imageUrl}
                alt={`Generated from prompt: ${prompt}`}
                className="w-full h-full object-contain"
              />
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-text-secondary mb-2">Prompt:</h4>
              <p className="text-text italic break-words text-sm">{prompt}</p>
            </div>
          </div>
          
          {/* Decision alert */}
          <div className="p-4 rounded-lg bg-primary/5 border border-primary/10 mt-auto">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-full bg-primary/10 text-primary flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium text-text text-lg">Important Decision</h3>
                <p className="text-text-secondary mt-1">
                  You now have two options:
                </p>
                <ul className="mt-2 space-y-1 text-text-secondary">
                  <li className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-success/10 text-success text-xs font-bold">✓</span>
                    <span><strong className="text-success">Submit:</strong> Lock in this image as your final submission. This will end your session.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-danger/10 text-danger text-xs font-bold">×</span>
                    <span><strong className="text-danger">Delete:</strong> Discard this image and try again with another prompt.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Status messages */}
          {success && (
            <div className="mt-4 rounded-lg bg-success/10 border border-success/20 p-4 text-success flex items-center gap-3 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">{success}</span>
            </div>
          )}
          
          {error && (
            <div className="mt-4 rounded-lg bg-danger/10 border border-danger/20 p-4 text-danger flex items-center gap-3 animate-fade-in">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}
          
          {/* Action buttons */}
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={initiateSubmit}
              className="btn btn-primary btn-lg"
              disabled={isSubmitting || isDeleting || !!success}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Submit This Image</span>
                </>
              )}
            </button>
            
            <button
              onClick={handleDelete}
              className="btn btn-outline btn-lg border-danger text-danger hover:bg-danger/10"
              disabled={isSubmitting || isDeleting || !!success}
            >
              {isDeleting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span>Delete & Try Again</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
} 