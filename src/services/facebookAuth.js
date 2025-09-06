/**
 * Facebook Login Authentication Service
 * Uses Facebook SDK for JavaScript
 */

class FacebookAuthService {
  constructor() {
    this.appId = import.meta.env.VITE_FACEBOOK_APP_ID;
    this.initialized = false;
    this.initPromise = null;
  }

  /**
   * Initialize Facebook SDK
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      // Check if FB SDK is already loaded
      if (window.FB) {
        this.configureFB();
        resolve();
        return;
      }

      // Load Facebook SDK
      const script = document.createElement('script');
      script.src = 'https://connect.facebook.net/en_US/sdk.js';
      script.async = true;
      script.defer = true;
      
      script.onload = () => {
        this.configureFB();
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error('Failed to load Facebook SDK'));
      };

      document.head.appendChild(script);
    });

    return this.initPromise;
  }

  /**
   * Configure Facebook SDK
   */
  configureFB() {
    if (!window.FB || !this.appId) return;

    try {
      window.FB.init({
        appId: this.appId,
        cookie: true,
        xfbml: true,
        version: 'v18.0'
      });

      this.initialized = true;
    } catch (error) {
      console.error('Facebook SDK initialization error:', error);
      throw new Error('Facebook SDK initialization failed');
    }
  }

  /**
   * Sign in with Facebook
   * @returns {Promise<Object>} Facebook authentication result
   */
  async signIn() {
    if (!this.appId) {
      throw new Error('Facebook App ID not configured. Please set VITE_FACEBOOK_APP_ID environment variable.');
    }

    try {
      await this.initialize();

      if (!window.FB) {
        throw new Error('Facebook SDK not loaded');
      }

      // Check current login status first
      const statusResponse = await this.getLoginStatus();
      
      if (statusResponse.status === 'connected') {
        // User is already logged in, get their info
        const userInfo = await this.getUserInfo(statusResponse.authResponse.accessToken);
        return {
          accessToken: statusResponse.authResponse.accessToken,
          userID: statusResponse.authResponse.userID,
          user: userInfo,
          provider: 'facebook',
          expiresIn: statusResponse.authResponse.expiresIn
        };
      }

      // User not logged in, show login dialog
      const loginResponse = await this.showLoginDialog();
      
      if (loginResponse.status !== 'connected') {
        throw new Error('Facebook login was not successful');
      }

      // Get user information
      const userInfo = await this.getUserInfo(loginResponse.authResponse.accessToken);

      return {
        accessToken: loginResponse.authResponse.accessToken,
        userID: loginResponse.authResponse.userID,
        user: userInfo,
        provider: 'facebook',
        expiresIn: loginResponse.authResponse.expiresIn
      };

    } catch (error) {
      console.error('Facebook login error:', error);
      
      if (error.message?.includes('popup_closed')) {
        throw new Error('Facebook login was cancelled');
      }
      
      throw new Error(error.message || 'Facebook login failed');
    }
  }

  /**
   * Get current Facebook login status
   * @returns {Promise<Object>} Login status response
   */
  getLoginStatus() {
    return new Promise((resolve, reject) => {
      window.FB.getLoginStatus((response) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve(response);
        }
      });
    });
  }

  /**
   * Show Facebook login dialog
   * @returns {Promise<Object>} Login response
   */
  showLoginDialog() {
    return new Promise((resolve, reject) => {
      window.FB.login((response) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else if (response.status === 'connected') {
          resolve(response);
        } else {
          reject(new Error('Facebook login cancelled or failed'));
        }
      }, {
        scope: 'email,public_profile',
        return_scopes: true
      });
    });
  }

  /**
   * Get user information from Facebook
   * @param {string} accessToken - Facebook access token
   * @returns {Promise<Object>} User information
   */
  getUserInfo(accessToken) {
    return new Promise((resolve, reject) => {
      window.FB.api('/me', {
        fields: 'id,name,email,first_name,last_name,picture.width(200).height(200)',
        access_token: accessToken
      }, (response) => {
        if (response.error) {
          reject(new Error(response.error.message));
        } else {
          resolve({
            id: response.id,
            email: response.email,
            name: response.name,
            firstName: response.first_name,
            lastName: response.last_name,
            picture: response.picture?.data?.url
          });
        }
      });
    });
  }

  /**
   * Sign out from Facebook
   * @returns {Promise<void>}
   */
  async signOut() {
    try {
      await this.initialize();
      
      if (window.FB) {
        return new Promise((resolve) => {
          window.FB.logout(() => {
            resolve();
          });
        });
      }
    } catch (error) {
      console.error('Facebook logout error:', error);
      // Don't throw error for logout failures
    }
  }

  /**
   * Get configuration status
   * @returns {Object} Configuration information
   */
  getStatus() {
    return {
      configured: !!this.appId,
      initialized: this.initialized,
      appId: this.appId,
      sdkLoaded: !!window.FB
    };
  }

  /**
   * Check if Facebook Login is supported
   * @returns {boolean} Whether Facebook Login is supported
   */
  isSupported() {
    // Facebook SDK works on all modern browsers
    return true;
  }
}

// Create and export singleton instance
const facebookAuthService = new FacebookAuthService();
export default facebookAuthService;

// Named exports for specific functions
export const {
  initialize: initializeFacebookAuth,
  signIn: signInWithFacebook,
  signOut: signOutFacebook,
  getStatus: getFacebookAuthStatus,
  isSupported: isFacebookLoginSupported
} = facebookAuthService;