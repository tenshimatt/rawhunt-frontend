/**
 * Apple Sign-in Authentication Service
 * Uses Apple's Sign in with Apple JS framework
 */

class AppleAuthService {
  constructor() {
    this.clientId = import.meta.env.VITE_APPLE_CLIENT_ID;
    this.redirectURI = `${window.location.origin}/auth/apple/callback`;
    this.initialized = false;
  }

  /**
   * Initialize Apple Sign-in
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;

    // Apple Sign-in doesn't require initialization like Google
    // The AppleID.auth object is available when the script loads
    if (window.AppleID) {
      try {
        await window.AppleID.auth.init({
          clientId: this.clientId,
          scope: 'name email',
          redirectURI: this.redirectURI,
          state: this.generateState(),
          usePopup: true
        });
        this.initialized = true;
      } catch (error) {
        console.error('Failed to initialize Apple Sign-in:', error);
        throw new Error('Apple Sign-in initialization failed');
      }
    }
  }

  /**
   * Sign in with Apple
   * @returns {Promise<Object>} Apple authentication result
   */
  async signIn() {
    if (!this.clientId) {
      throw new Error('Apple Client ID not configured. Please set VITE_APPLE_CLIENT_ID environment variable.');
    }

    try {
      await this.initialize();

      if (!window.AppleID) {
        throw new Error('Apple Sign-in SDK not loaded');
      }

      const response = await window.AppleID.auth.signIn();
      
      return {
        identityToken: response.authorization.id_token,
        authorizationCode: response.authorization.code,
        user: response.user ? {
          email: response.user.email,
          firstName: response.user.name?.firstName,
          lastName: response.user.name?.lastName
        } : null,
        provider: 'apple',
        state: response.authorization.state
      };

    } catch (error) {
      console.error('Apple Sign-in error:', error);
      
      if (error.error === 'popup_closed_by_user') {
        throw new Error('Sign-in was cancelled');
      } else if (error.error === 'popup_blocked') {
        throw new Error('Please allow popups for Apple Sign-in');
      }
      
      throw new Error(error.message || 'Apple Sign-in failed');
    }
  }

  /**
   * Sign out (Apple doesn't provide a sign-out method)
   */
  async signOut() {
    // Apple Sign-in doesn't have a JavaScript sign-out method
    // Sign-out is handled through the user's Apple ID settings
    console.log('Apple Sign-in: Sign-out handled through Apple ID settings');
  }

  /**
   * Generate a random state parameter for security
   * @returns {string} Random state string
   */
  generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Get configuration status
   * @returns {Object} Configuration information
   */
  getStatus() {
    return {
      configured: !!this.clientId,
      initialized: this.initialized,
      clientId: this.clientId ? `${this.clientId.substring(0, 20)}...` : null,
      sdkLoaded: !!window.AppleID
    };
  }

  /**
   * Check if Apple Sign-in is supported
   * @returns {boolean} Whether Apple Sign-in is supported
   */
  isSupported() {
    // Apple Sign-in is supported on:
    // - iOS 13+ (Safari, in-app browsers)
    // - macOS 10.15+ (Safari)
    // - Other browsers with the JS SDK
    return true; // The JS SDK works on all modern browsers
  }
}

// Create and export singleton instance
const appleAuthService = new AppleAuthService();
export default appleAuthService;

// Named exports for specific functions
export const {
  initialize: initializeAppleAuth,
  signIn: signInWithApple,
  signOut: signOutApple,
  getStatus: getAppleAuthStatus,
  isSupported: isAppleSignInSupported
} = appleAuthService;