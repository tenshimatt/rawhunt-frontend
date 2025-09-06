# Social Authentication Setup Guide

This guide provides step-by-step instructions for setting up Google OAuth2, Facebook Login, and Apple Sign-in for production deployment.

## Overview

The Raw Pet Food Community Platform supports three major social authentication providers:

1. **Google OAuth2** - Modern, secure OAuth2 implementation with PKCE
2. **Facebook Login** - Facebook SDK integration with proper permissions
3. **Apple Sign-in** - Privacy-focused authentication for iOS/macOS users

## Prerequisites

- Domain name with SSL certificate
- Backend API supporting social authentication endpoints
- Development environment with environment variables configured

## 1. Google OAuth2 Setup

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing project
3. Enable the **Google Identity API**

### Step 2: Configure OAuth2 Consent Screen

1. Navigate to **APIs & Services** > **OAuth consent screen**
2. Choose **External** user type (for public applications)
3. Fill in required information:
   - **App name**: Raw Pet Food Community Platform
   - **User support email**: Your support email
   - **Developer contact information**: Your development team email
4. Add authorized domains:
   - `yourdomain.com`
   - `localhost` (for development)

### Step 3: Create OAuth2 Credentials

1. Navigate to **APIs & Services** > **Credentials**
2. Click **Create Credentials** > **OAuth client ID**
3. Choose **Web application**
4. Configure:
   - **Name**: Raw Pet Food Platform Web Client
   - **Authorized JavaScript origins**:
     - `https://yourdomain.com`
     - `http://localhost:5173` (for development)
   - **Authorized redirect URIs**:
     - `https://yourdomain.com/auth/google/callback`
     - `http://localhost:5173/auth/google/callback`

### Step 4: Configure Environment Variables

```bash
# .env.production
VITE_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## 2. Facebook Login Setup

### Step 1: Create Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Click **Create App**
3. Choose **Consumer** app type
4. Fill in app details:
   - **App Name**: Raw Pet Food Community Platform
   - **Contact Email**: Your support email

### Step 2: Configure Facebook Login

1. In your Facebook App dashboard, go to **Products** > **Facebook Login**
2. Click **Settings**
3. Configure **Valid OAuth Redirect URIs**:
   - `https://yourdomain.com/auth/facebook/callback`
   - `http://localhost:5173/auth/facebook/callback` (for development)

### Step 3: Add Domains

1. Go to **Settings** > **Basic**
2. Add **App Domains**:
   - `yourdomain.com`
   - `localhost` (for development)

### Step 4: App Review (Production Only)

For production use, Facebook requires app review for certain permissions:

1. Go to **App Review** > **Permissions and Features**
2. Request review for:
   - `email` permission
   - `public_profile` permission

### Step 5: Environment Variables

```bash
# .env.production
VITE_FACEBOOK_APP_ID=your-facebook-app-id
```

## 3. Apple Sign-in Setup

### Step 1: Apple Developer Account

1. Enroll in [Apple Developer Program](https://developer.apple.com/programs/)
2. Go to [Apple Developer Console](https://developer.apple.com/account/)

### Step 2: Register App ID

1. Navigate to **Certificates, Identifiers & Profiles** > **Identifiers**
2. Click **+** to create new App ID
3. Configure:
   - **Description**: Raw Pet Food Community Platform
   - **Bundle ID**: `com.rawgle.platform` (or your preference)
   - **Capabilities**: Enable **Sign In with Apple**

### Step 3: Create Service ID

1. Create new **Services ID**
2. Configure:
   - **Description**: Raw Pet Food Web Service
   - **Identifier**: `com.rawgle.platform.web`
   - **Enable Sign In with Apple**
3. Configure domains and redirect URLs:
   - **Domains**: `yourdomain.com`
   - **Redirect URLs**: `https://yourdomain.com/auth/apple/callback`

### Step 4: Environment Variables

```bash
# .env.production
VITE_APPLE_CLIENT_ID=com.rawgle.platform.web
```

## 4. Backend Integration

Ensure your backend API supports these endpoints:

### Google OAuth2
```
POST /api/auth/google
Body: { "credential": "jwt_token", "userInfo": {...} }
```

### Facebook Login
```
POST /api/auth/facebook  
Body: { "accessToken": "facebook_access_token", "userInfo": {...} }
```

### Apple Sign-in
```
POST /api/auth/apple
Body: { "identityToken": "apple_identity_token", "userInfo": {...} }
```

## 5. Testing

### Development Testing

1. Set up `.env.development`:
```bash
VITE_GOOGLE_CLIENT_ID=your-dev-google-client-id.apps.googleusercontent.com
VITE_FACEBOOK_APP_ID=your-dev-facebook-app-id
VITE_APPLE_CLIENT_ID=com.rawgle.platform.web
```

2. Start development server:
```bash
npm run dev
```

3. Navigate to login page and test each provider

### Production Testing

1. Deploy to staging environment with production credentials
2. Test each authentication flow
3. Verify user data is correctly synchronized with backend
4. Test error scenarios (cancelled logins, network failures)

## 6. Security Considerations

### Google OAuth2
- Always use HTTPS in production
- Validate JWT tokens on the backend
- Store client secrets securely (server-side only)

### Facebook Login
- Verify access tokens server-side
- Use App Secret for additional security
- Implement proper CSRF protection

### Apple Sign-in
- Validate identity tokens server-side
- Handle email relay addresses properly
- Respect user privacy preferences

## 7. Monitoring and Analytics

### Recommended Tracking Events

```javascript
// Track successful authentication
analytics.track('User Authenticated', {
  provider: 'google|facebook|apple',
  new_user: boolean,
  timestamp: Date.now()
});

// Track authentication errors
analytics.track('Authentication Error', {
  provider: 'google|facebook|apple',
  error: error.message,
  timestamp: Date.now()
});
```

## 8. Troubleshooting

### Common Issues

**Google OAuth2**
- **Error**: `redirect_uri_mismatch`
- **Solution**: Ensure redirect URI exactly matches configured URI in Google Console

**Facebook Login**
- **Error**: `App Not Setup`
- **Solution**: Complete app review process for required permissions

**Apple Sign-in**
- **Error**: `invalid_client`
- **Solution**: Verify Service ID is correctly configured with domains

### Debug Mode

In development, the social login buttons show configuration status:

```
Development Info:
• Google: ✅ Configured
• Facebook: ❌ Not configured  
• Apple: ✅ Configured
```

## 9. Compliance and Privacy

### GDPR Compliance
- Clearly communicate data usage in privacy policy
- Provide mechanism for data deletion
- Obtain explicit consent for data processing

### CCPA Compliance
- Provide opt-out mechanism for data sales
- Maintain user data inventory
- Honor data deletion requests

## 10. Production Deployment Checklist

### Pre-deployment
- [ ] All environment variables configured
- [ ] SSL certificates installed
- [ ] OAuth redirect URIs updated for production
- [ ] Backend endpoints tested
- [ ] Error handling implemented
- [ ] Analytics tracking configured

### Post-deployment
- [ ] End-to-end authentication flow tested
- [ ] Error monitoring active
- [ ] Performance metrics collected
- [ ] User feedback mechanism in place

## Support and Maintenance

### Regular Tasks
- Monitor authentication success rates
- Review error logs weekly
- Update OAuth scopes as needed
- Renew certificates before expiration

### Emergency Procedures
- Have fallback authentication method ready
- Monitor provider status pages
- Implement graceful degradation for provider outages

---

For technical support or questions about this setup, contact the development team or refer to the individual provider documentation:

- [Google Identity Documentation](https://developers.google.com/identity)
- [Facebook Login Documentation](https://developers.facebook.com/docs/facebook-login/)
- [Apple Sign-in Documentation](https://developer.apple.com/sign-in-with-apple/)