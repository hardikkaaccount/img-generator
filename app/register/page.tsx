'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Register() {
  const router = useRouter();

  // Redirect to login page after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/login');
    }, 5000); // Redirect after 5 seconds
    
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <main>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <div className="w-full max-w-md bg-white p-8 shadow-md rounded-lg">
          <h1 className="text-2xl font-bold mb-6 text-center">Registration Closed</h1>
          
          <div className="space-y-4">
            <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
              <p className="text-center text-amber-800">
                Registration is closed. Please use your provided warrior credentials to log in.
              </p>
              <p className="text-center text-amber-800 text-sm mt-2">
                You will be redirected to the login page in a few seconds...
              </p>
            </div>
            
            <div className="text-center mt-4">
              <Link href="/login" className="btn btn-primary w-full">
                Go to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
} 