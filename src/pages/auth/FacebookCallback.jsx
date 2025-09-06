import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const FacebookCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleFacebookCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Facebook authentication failed: ${error}`);
        }

        console.log('Facebook OAuth callback received:', { code: code?.substring(0, 20) + '...', state });

        setStatus('success');
        setTimeout(() => {
          navigate('/auth/login', { 
            state: { 
              message: 'Facebook authentication successful! Please try logging in again.',
              type: 'success'
            }
          });
        }, 2000);

      } catch (error) {
        console.error('Facebook callback error:', error);
        setStatus('error');
        setTimeout(() => {
          navigate('/auth/login', {
            state: { message: error.message, type: 'error' }
          });
        }, 3000);
      }
    };

    handleFacebookCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto mb-6" fill="#1877f2" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>

        {status === 'processing' && (
          <div>
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Facebook Authentication</h2>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Facebook Authentication Successful!</h2>
            <p className="text-gray-600">Redirecting you back to login...</p>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500">
          <p>Debug Info:</p>
          <p>Code: {searchParams.get('code') ? 'Received' : 'Not received'}</p>
          <p>State: {searchParams.get('state') || 'None'}</p>
        </div>
      </div>
    </div>
  );
};

export default FacebookCallback;