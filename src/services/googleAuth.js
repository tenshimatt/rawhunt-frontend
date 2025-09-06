/**
 * Google OAuth2 Authentication Service
 * Uses Google Identity Services for modern, secure authentication
 */

class GoogleAuthService {
  constructor() {
    this.clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    this.initialized = false;
    this.initPromise = null;
  }

  /**
   * Initialize Google Identity Services
   * @returns {Promise<void>}
   */
  async initialize() {
    if (this.initialized) return;
    if (this.initPromise) return this.initPromise;

    this.initPromise = new Promise((resolve, reject) => {
      // Wait for Google Identity Services to load
      const checkGoogleLoaded = () => {
        if (window.google && window.google.accounts) {
          try {
            // Initialize Google Identity Services
            window.google.accounts.id.initialize({
              client_id: this.clientId,
              callback: this.handleCredentialResponse.bind(this),
              auto_select: false,
              cancel_on_tap_outside: true,
            });

            this.initialized = true;
            resolve();
          } catch (error) {
            console.error('Failed to initialize Google Identity Services:', error);
            reject(error);
          }
        } else {
          // Retry after a short delay
          setTimeout(checkGoogleLoaded, 100);
        }
      };

      checkGoogleLoaded();
    });

    return this.initPromise;
  }

  /**
   * Handle the credential response from Google
   * @param {Object} response - Google credential response
   */
  handleCredentialResponse(response) {
    if (this.onCredentialCallback) {
      this.onCredentialCallback(response);
    }
  }

  /**
   * Set the callback function for credential responses
   * @param {Function} callback - Function to handle credential response
   */
  setCredentialCallback(callback) {
    this.onCredentialCallback = callback;
  }

  /**
   * Sign in with Google using popup
   * @returns {Promise<Object>} User credential information
   */
  async signInWithPopup() {
    if (!this.clientId) {
      throw new Error('Google Client ID not configured. Please set VITE_GOOGLE_CLIENT_ID environment variable.');
    }

    await this.initialize();

    return new Promise((resolve, reject) => {
      try {
        // Set up the callback for this specific sign-in attempt
        this.setCredentialCallback((response) => {
          if (response.credential) {
            // Parse the JWT credential
            const userInfo = this.parseJWTCredential(response.credential);
            resolve({
              credential: response.credential,
              user: userInfo,
              provider: 'google'
            });
          } else {
            reject(new Error('No credential received from Google'));
          }
        });

        // Show the One Tap dialog or redirect to Google sign-in
        window.google.accounts.id.prompt((notification) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            // One Tap was not displayed or skipped, fall back to popup
            this.showPopupSignIn().then(resolve).catch(reject);
          }
        });

      } catch (error) {
        console.error('Google sign-in error:', error);
        reject(error);
      }
    });
  }

  /**
   * Show Google sign-in popup as fallback
   * @returns {Promise<Object>} User credential information
   */
  async showPopupSignIn() {
    return new Promise((resolve, reject) => {
      // Use Google OAuth2 popup flow
      const authUrl = this.buildAuthUrl();
      
      const popup = window.open(
        authUrl,
        'google-signin',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      );

      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          reject(new Error('Google sign-in popup was closed'));
        }
      }, 1000);

      // Listen for the popup to send back the authorization code
      const messageListener = (event) => {
        if (event.origin !== window.location.origin) return;
        
        if (event.data.type === 'GOOGLE_AUTH_SUCCESS') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          resolve(event.data.result);
        } else if (event.data.type === 'GOOGLE_AUTH_ERROR') {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          popup.close();
          reject(new Error(event.data.error));
        }
      };

      window.addEventListener('message', messageListener);
    });
  }

  /**
   * Build Google OAuth2 authorization URL
   * @returns {string} Authorization URL
   */
  buildAuthUrl() {
    const params = new URLSearchParams({
      client_id: this.clientId,
      redirect_uri: `${window.location.origin}/auth/google/callback`,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: this.generateState()
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Generate a random state parameter for OAuth2 security
   * @returns {string} Random state string
   */
  generateState() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

  /**
   * Parse JWT credential from Google
   * @param {string} credential - JWT credential string
   * @returns {Object} Parsed user information
   */
  parseJWTCredential(credential) {
    try {
      // Parse JWT without verification (Google already verified it)
      const [header, payload, signature] = credential.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      
      return {
        id: decodedPayload.sub,
        email: decodedPayload.email,
        name: decodedPayload.name,
        given_name: decodedPayload.given_name,
        family_name: decodedPayload.family_name,
        picture: decodedPayload.picture,
        email_verified: decodedPayload.email_verified,
        locale: decodedPayload.locale
      };
    } catch (error) {
      console.error('Failed to parse Google JWT credential:', error);
      throw new Error('Invalid credential format');
    }
  }

  /**
   * Sign out the user
   * @returns {Promise<void>}
   */
  async signOut() {
    await this.initialize();
    
    if (window.google && window.google.accounts) {
      window.google.accounts.id.disableAutoSelect();
    }
  }

  /**
   * Get configuration status
   * @returns {Object} Configuration information
   */
  getStatus() {
    return {
      configured: !!this.clientId,
      initialized: this.initialized,
      clientId: this.clientId ? `${this.clientId.substring(0, 12)}...` : null
    };
  }
}

// Create and export singleton instance
const googleAuthService = new GoogleAuthService();
export default googleAuthService;

// Named exports for specific functions
export const {
  initialize: initializeGoogleAuth,
  signInWithPopup: signInWithGoogle,
  signOut: signOutGoogle,
  getStatus: getGoogleAuthStatus
} = googleAuthService;