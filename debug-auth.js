#!/usr/bin/env node

/**
 * Authentication Debug Script
 * Tests the complete authentication flow between frontend and backend
 */

import axios from 'axios';

const BACKEND_URL = 'http://localhost:8787/api';
const FRONTEND_URL = 'http://localhost:5174';

async function debugAuth() {
  console.log('🔍 RAW FOOD PLATFORM - AUTHENTICATION DEBUG');
  console.log('='.repeat(50));
  
  try {
    // Test 1: Backend availability
    console.log('\n1️⃣ Testing Backend API Availability...');
    try {
      const healthCheck = await axios.get(`${BACKEND_URL.replace('/api', '')}/health`);
      console.log('✅ Backend is running:', healthCheck.status === 200 ? 'ONLINE' : 'OFFLINE');
    } catch (error) {
      console.log('❌ Backend health check failed:', error.message);
    }
    
    // Test 2: Registration
    console.log('\n2️⃣ Testing User Registration...');
    const testUser = {
      email: `debug-${Date.now()}@test.com`,
      password: 'Test123!@#',
      firstName: 'Debug',
      lastName: 'User',
      phoneNumber: '555-0123'
    };
    
    try {
      const registerResponse = await axios.post(`${BACKEND_URL}/auth/register`, testUser);
      console.log('✅ Registration successful:', registerResponse.data.success);
      console.log('👤 User ID:', registerResponse.data.data.user.id);
      console.log('💰 PAWS Balance:', registerResponse.data.data.user.paws_balance);
      
      // Store token for subsequent tests
      const token = registerResponse.data.data.token;
      
      // Test 3: Login
      console.log('\n3️⃣ Testing User Login...');
      const loginResponse = await axios.post(`${BACKEND_URL}/auth/login`, {
        email: testUser.email,
        password: testUser.password
      });
      console.log('✅ Login successful:', loginResponse.data.success);
      
      // Test 4: Protected endpoint access
      console.log('\n4️⃣ Testing Protected Endpoint Access...');
      const profileResponse = await axios.get(`${BACKEND_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Profile access successful:', profileResponse.data.success);
      console.log('📧 User email:', profileResponse.data.data.user.email);
      
      // Test 5: Frontend API configuration
      console.log('\n5️⃣ Testing Frontend API Configuration...');
      
      // Check if frontend is properly configured to use localhost:8787
      console.log('🔧 Expected API Base URL (dev):', 'http://localhost:8787');
      console.log('🔧 Frontend running on:', FRONTEND_URL);
      
      // Test 6: CORS check
      console.log('\n6️⃣ Testing CORS Configuration...');
      try {
        const corsResponse = await axios.options(`${BACKEND_URL}/auth/login`, {
          headers: {
            'Origin': FRONTEND_URL,
            'Access-Control-Request-Method': 'POST',
            'Access-Control-Request-Headers': 'Content-Type, Authorization'
          }
        });
        console.log('✅ CORS preflight successful:', corsResponse.status === 204);
      } catch (error) {
        console.log('❌ CORS preflight failed:', error.message);
      }
      
      // Test 7: Logout
      console.log('\n7️⃣ Testing User Logout...');
      const logoutResponse = await axios.post(`${BACKEND_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Logout successful:', logoutResponse.data.success);
      
    } catch (registrationError) {
      console.log('❌ Registration failed:', registrationError.response?.data || registrationError.message);
    }
    
  } catch (error) {
    console.error('🚨 Debug script error:', error.message);
  }
}

// Now let's identify the specific issue
async function identifyIssues() {
  console.log('\n🔍 POTENTIAL ISSUES ANALYSIS');
  console.log('='.repeat(50));
  
  const issues = [];
  
  // Issue 1: Check API base URL configuration
  console.log('\n📍 Issue 1: API Configuration');
  console.log('Frontend .env.development shows:', 'VITE_API_BASE_URL=https://rawgle-backend-prod.findrawdogfood.workers.dev');
  console.log('But api.js uses:', 'http://localhost:8787 in DEV mode');
  console.log('This should be correct - ✅ No issue here');
  
  // Issue 2: Auth0 vs Traditional Auth conflict
  console.log('\n📍 Issue 2: Dual Authentication Systems');
  console.log('❌ POTENTIAL ISSUE: The app has BOTH Auth0 and traditional auth enabled');
  console.log('   - Auth0Provider wraps the entire app');
  console.log('   - AuthContext tries to handle both Auth0 and traditional auth');
  console.log('   - This can cause conflicts and confusion in auth state');
  issues.push('Dual authentication systems causing conflicts');
  
  // Issue 3: Auth0 environment variables
  console.log('\n📍 Issue 3: Auth0 Configuration');
  console.log('Auth0 environment variables are not set in .env.development');
  console.log('This means Auth0 will be disabled, but the provider is still active');
  console.log('✅ This is actually good - traditional auth should work');
  
  // Issue 4: Loading state issues
  console.log('\n📍 Issue 4: Loading State Management');
  console.log('AuthContext combines auth0Loading and traditional loading');
  console.log('This can cause the app to be stuck in loading state');
  issues.push('Complex loading state management between dual auth systems');
  
  // Issue 5: Environment mismatch
  console.log('\n📍 Issue 5: Environment Configuration');
  console.log('❌ POTENTIAL ISSUE: .env.development has production URL but api.js overrides it');
  console.log('This can cause confusion during development');
  
  console.log('\n🎯 SUMMARY OF IDENTIFIED ISSUES:');
  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue}`);
  });
  
  return issues;
}

// Main execution
(async () => {
  await debugAuth();
  const issues = await identifyIssues();
  
  console.log('\n💡 RECOMMENDED FIXES:');
  console.log('1. Remove Auth0 provider temporarily to simplify auth flow');
  console.log('2. Update AuthContext to handle only traditional auth');
  console.log('3. Ensure consistent environment configuration');
  console.log('4. Test the simplified auth flow');
  
  process.exit(0);
})();