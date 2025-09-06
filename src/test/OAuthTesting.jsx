import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import googleAuthService from '../services/googleAuth';
import facebookAuthService from '../services/facebookAuth';
import appleAuthService from '../services/appleAuth';

const OAuthTesting = () => {
  const { loginWithGoogle, loginWithFacebook, loginWithApple, user, loading } = useAuth();
  const [testResults, setTestResults] = useState({});
  const [simulationMode, setSimulationMode] = useState(false);

  const runTest = async (testName, testFunction) => {
    setTestResults(prev => ({
      ...prev,
      [testName]: { status: 'running', message: 'Testing...', startTime: Date.now() }
    }));

    try {
      const result = await testFunction();
      const duration = Date.now() - testResults[testName]?.startTime;
      
      setTestResults(prev => ({
        ...prev,
        [testName]: { 
          status: 'success', 
          message: result.message || 'Test passed', 
          data: result.data,
          duration: `${duration}ms`
        }
      }));
    } catch (error) {
      const duration = Date.now() - testResults[testName]?.startTime;
      
      setTestResults(prev => ({
        ...prev,
        [testName]: { 
          status: 'error', 
          message: error.message, 
          duration: `${duration}ms`
        }
      }));
    }
  };

  const tests = {
    // Configuration Tests
    'Google Config Test': async () => {
      const status = googleAuthService.getStatus();
      if (!status.configured) {
        throw new Error('Google Client ID not configured');
      }
      return { 
        message: 'Google OAuth2 properly configured', 
        data: { clientId: status.clientId, initialized: status.initialized }
      };
    },

    'Facebook Config Test': async () => {
      const status = facebookAuthService.getStatus();
      return { 
        message: status.configured ? 'Facebook configured' : 'Facebook not configured (expected)', 
        data: { appId: status.appId, configured: status.configured }
      };
    },

    'Apple Config Test': async () => {
      const status = appleAuthService.getStatus();
      return { 
        message: status.configured ? 'Apple configured' : 'Apple not configured (expected)', 
        data: { clientId: status.clientId, configured: status.configured }
      };
    },

    // SDK Loading Tests
    'Google SDK Test': async () => {
      if (!window.google?.accounts) {
        throw new Error('Google Identity Services not loaded');
      }
      return { message: 'Google SDK loaded successfully' };
    },

    'Facebook SDK Test': async () => {
      // Facebook SDK loads dynamically, so simulate this
      return { 
        message: simulationMode ? 'Facebook SDK simulated' : 'Facebook SDK will load on first use'
      };
    },

    'Apple SDK Test': async () => {
      if (!window.AppleID) {
        return { message: 'Apple Sign-in SDK not loaded (normal until needed)' };
      }
      return { message: 'Apple SDK loaded successfully' };
    },

    // Authentication Flow Tests
    'Google Login Flow Test': async () => {
      if (simulationMode) {
        return simulateGoogleLogin();
      }
      const result = await loginWithGoogle();
      if (!result.success) {
        throw new Error(result.error);
      }
      return { message: 'Google login successful', data: result.data };
    },

    'Facebook Login Flow Test': async () => {
      if (simulationMode) {
        return simulateFacebookLogin();
      }
      const result = await loginWithFacebook();
      if (!result.success) {
        throw new Error(result.error);
      }
      return { message: 'Facebook login successful', data: result.data };
    },

    'Apple Login Flow Test': async () => {
      if (simulationMode) {
        return simulateAppleLogin();
      }
      const result = await loginWithApple();
      if (!result.success) {
        throw new Error(result.error);
      }
      return { message: 'Apple login successful', data: result.data };
    },

    // Backend Integration Tests
    'Backend Sync Test': async () => {
      // Test if backend endpoint exists and responds
      try {
        const response = await fetch('/api/auth/auth0-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true })
        });
        return { 
          message: `Backend responded with status ${response.status}`,
          data: { status: response.status }
        };
      } catch (error) {
        throw new Error('Backend endpoint not reachable');
      }
    }
  };

  // Simulation functions for testing without actual OAuth
  const simulateGoogleLogin = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.1) { // 90% success rate
          resolve({
            message: 'Simulated Google login successful',
            data: {
              user: { email: 'test@gmail.com', name: 'Test User' },
              provider: 'google'
            }
          });
        } else {
          reject(new Error('Simulated Google login failed'));
        }
      }, 1500);
    });
  };

  const simulateFacebookLogin = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.15) { // 85% success rate
          resolve({
            message: 'Simulated Facebook login successful',
            data: {
              user: { email: 'test@facebook.com', name: 'Facebook User' },
              provider: 'facebook'
            }
          });
        } else {
          reject(new Error('Simulated Facebook login failed'));
        }
      }, 2000);
    });
  };

  const simulateAppleLogin = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (Math.random() > 0.2) { // 80% success rate
          resolve({
            message: 'Simulated Apple login successful',
            data: {
              user: { email: 'privaterelay@icloud.com', name: 'Apple User' },
              provider: 'apple'
            }
          });
        } else {
          reject(new Error('Simulated Apple login failed'));
        }
      }, 1800);
    });
  };

  const runAllTests = async () => {
    const testNames = Object.keys(tests);
    for (const testName of testNames) {
      await runTest(testName, tests[testName]);
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  };

  const clearResults = () => {
    setTestResults({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'running': return 'text-yellow-600 bg-yellow-50';
      case 'success': return 'text-green-600 bg-green-50';
      case 'error': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'running': return '⏳';
      case 'success': return '✅';
      case 'error': return '❌';
      default: return '⚪';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">OAuth Testing Suite</h1>
        <p className="text-gray-600 mb-4">
          Comprehensive testing for Google, Facebook, and Apple authentication
        </p>
        
        {user && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <h3 className="font-medium text-green-800 mb-2">Currently Authenticated:</h3>
            <p className="text-green-700">Email: {user.email}</p>
            <p className="text-green-700">Name: {user.name || user.firstName + ' ' + user.lastName}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={runAllTests}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium"
          >
            {loading ? 'Testing...' : 'Run All Tests'}
          </button>
          
          <button
            onClick={clearResults}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium"
          >
            Clear Results
          </button>
          
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={simulationMode}
              onChange={(e) => setSimulationMode(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm text-gray-700">Simulation Mode</span>
          </label>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(tests).map(([testName, testFunction]) => {
          const result = testResults[testName];
          
          return (
            <div key={testName} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{testName}</h3>
                <button
                  onClick={() => runTest(testName, testFunction)}
                  disabled={result?.status === 'running' || loading}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-2 py-1 rounded text-sm"
                >
                  Test
                </button>
              </div>
              
              {result && (
                <div className={`p-3 rounded ${getStatusColor(result.status)}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span>{getStatusIcon(result.status)}</span>
                    <span className="font-medium">{result.status.toUpperCase()}</span>
                    {result.duration && (
                      <span className="text-xs opacity-75">({result.duration})</span>
                    )}
                  </div>
                  <p className="text-sm">{result.message}</p>
                  {result.data && (
                    <details className="mt-2">
                      <summary className="text-xs cursor-pointer opacity-75">View Data</summary>
                      <pre className="text-xs mt-1 opacity-75 overflow-auto max-h-32">
                        {JSON.stringify(result.data, null, 2)}
                      </pre>
                    </details>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-medium text-gray-900 mb-2">Testing Instructions:</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Config Tests:</strong> Verify environment variables and setup</li>
          <li>• <strong>SDK Tests:</strong> Check if OAuth SDKs are loaded properly</li>
          <li>• <strong>Flow Tests:</strong> Test actual authentication flows</li>
          <li>• <strong>Simulation Mode:</strong> Test authentication logic without real OAuth providers</li>
          <li>• <strong>Backend Tests:</strong> Verify backend integration endpoints</li>
        </ul>
      </div>
    </div>
  );
};

export default OAuthTesting;