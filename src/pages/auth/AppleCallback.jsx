import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AppleCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('processing');

  useEffect(() => {
    const handleAppleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');

        if (error) {
          throw new Error(`Apple Sign-in failed: ${error}`);
        }

        console.log('Apple OAuth callback received:', { code: code?.substring(0, 20) + '...', state });

        setStatus('success');
        setTimeout(() => {
          navigate('/auth/login', { 
            state: { 
              message: 'Apple Sign-in successful! Please try logging in again.',
              type: 'success'
            }
          });
        }, 2000);

      } catch (error) {
        console.error('Apple callback error:', error);
        setStatus('error');
        setTimeout(() => {
          navigate('/auth/login', {
            state: { message: error.message, type: 'error' }
          });
        }, 3000);
      }
    };

    handleAppleCallback();
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <svg className="w-16 h-16 mx-auto mb-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701"/>
        </svg>

        {status === 'processing' && (
          <div>
            <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Processing Apple Sign-in</h2>
          </div>
        )}

        {status === 'success' && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Apple Sign-in Successful!</h2>
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

export default AppleCallback;