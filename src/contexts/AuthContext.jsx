import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI, apiUtils } from '../services/api';
import googleAuthService from '../services/googleAuth';
import appleAuthService from '../services/appleAuth';
import facebookAuthService from '../services/facebookAuth';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Initialize auth state on app load
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      // Check if user has a valid token and load their profile
      if (apiUtils.isAuthenticated()) {
        const response = await authAPI.getCurrentUser();
        setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      // Token might be invalid, clear it
      apiUtils.clearAuthToken();
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.login(credentials);
      setUser(response.data.user);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.register(userData);
      setUser(response.data.user);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      // Traditional logout
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      setError(null);
    }
  };

  // Google OAuth2 login
  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Google OAuth is configured
      const googleStatus = googleAuthService.getStatus();
      if (!googleStatus.configured) {
        throw new Error('Google OAuth not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
      }

      // Sign in with Google using redirect (no popup)
      const googleResult = await googleAuthService.signInWithRedirect();
      
      // Send the Google credential to our backend for verification and user creation/login
      const response = await authAPI.syncAuth0User({
        provider: 'google',
        providerToken: googleResult.credential,
        userInfo: googleResult.user
      });

      setUser(response.data.user);
      return { success: true, data: response.data };

    } catch (error) {
      console.error('Google login error:', error);
      const errorMessage = error.message || 'Google login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const loginWithFacebook = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Facebook Login is configured
      const facebookStatus = facebookAuthService.getStatus();
      if (!facebookStatus.configured) {
        throw new Error('Facebook Login not configured. Please set VITE_FACEBOOK_APP_ID environment variable.');
      }

      // Sign in with Facebook
      const facebookResult = await facebookAuthService.signIn();
      
      // Send the Facebook access token to our backend for verification and user creation/login
      const response = await authAPI.syncAuth0User({
        provider: 'facebook',
        providerToken: facebookResult.accessToken,
        userInfo: facebookResult.user
      });

      setUser(response.data.user);
      return { success: true, data: response.data };

    } catch (error) {
      console.error('Facebook login error:', error);
      const errorMessage = error.message || 'Facebook login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const loginWithApple = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if Apple Sign-in is configured
      const appleStatus = appleAuthService.getStatus();
      if (!appleStatus.configured) {
        throw new Error('Apple Sign-in not configured. Please set VITE_APPLE_CLIENT_ID environment variable.');
      }

      // Check if Apple Sign-in is supported
      if (!appleAuthService.isSupported()) {
        throw new Error('Apple Sign-in is not supported on this device/browser.');
      }

      // Sign in with Apple
      const appleResult = await appleAuthService.signIn();
      
      // Send the Apple identity token to our backend for verification and user creation/login
      const response = await authAPI.syncAuth0User({
        provider: 'apple',
        providerToken: appleResult.identityToken,
        authorizationCode: appleResult.authorizationCode,
        userInfo: appleResult.user
      });

      setUser(response.data.user);
      return { success: true, data: response.data };

    } catch (error) {
      console.error('Apple Sign-in error:', error);
      const errorMessage = error.message || 'Apple Sign-in failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const loginWithInstagram = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // TODO: Implement Instagram login (if needed)
      throw new Error('Instagram login not yet implemented.');
      
    } catch (error) {
      const errorMessage = error.message || 'Instagram login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const loginWithSocial = async (provider) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return await loginWithGoogle();
      case 'facebook':
        return await loginWithFacebook();
      case 'apple':
        return await loginWithApple();
      case 'instagram':
        return await loginWithInstagram();
      default:
        const errorMessage = `Social login with ${provider} is not supported`;
        setError(errorMessage);
        return { success: false, error: errorMessage };
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.updateProfile(profileData);
      setUser(response.data.user);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const changePassword = async (passwordData) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await authAPI.changePassword(passwordData);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getCurrentUser();
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    refreshUser,
    clearError,
    // Social login methods (currently disabled)
    loginWithGoogle,
    loginWithFacebook,
    loginWithApple,
    loginWithInstagram,
    loginWithSocial,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};