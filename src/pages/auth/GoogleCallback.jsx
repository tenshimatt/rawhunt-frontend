import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const GoogleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogle } = useAuth();
  const [status, setStatus] = useState('processing');
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleGoogleCallback = async () => {
      try {
        setStatus('processing');
        
        // Get authorization code from URL params
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Google authentication failed: ${error}`);
        }

        if (!code) {
          throw new Error('No authorization code received from Google');
        }

        console.log('Google OAuth callback received:', { code: code?.substring(0, 20) + '...', state });

        // For now, redirect back to login with success message
        // In a full implementation, you'd exchange the code for tokens here
        setStatus('success');
        
        setTimeout(() => {
          navigate('/auth/login', { 
            state: { 
              message: 'Google authentication successful! Please try logging in again.',
              type: 'success'
            }
          });
        }, 2000);

      } catch (error) {
        console.error('Google callback error:', error);
        setError(error.message);
        setStatus('error');
        
        setTimeout(() => {
          navigate('/auth/login', {
            state: {
              message: error.message,
              type: 'error'
            }
          });
        }, 3000);
      }
    };

    handleGoogleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <svg className="w-16 h-16 mx-auto mb-4" viewBox="0 0 24 24">
            <path fill="#4285f4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34a853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#fbbc05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#ea4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
        </div>

        {status === 'processing' && (
          <div>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Google Authentication</h2>
            <p className="text-gray-600">Please wait while we complete your sign-in...</p>
          </div>
        )}

        {status === 'success' && (
          <div>
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Google Authentication Successful!</h2>
            <p className="text-gray-600">Redirecting you back to login...</p>
          </div>
        )}

        {status === 'error' && (
          <div>
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Failed</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/auth/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>Debug Info:</p>
          <p>Code: {searchParams.get('code') ? 'Received' : 'Not received'}</p>
          <p>State: {searchParams.get('state') || 'None'}</p>
          <p>Error: {searchParams.get('error') || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default GoogleCallback;