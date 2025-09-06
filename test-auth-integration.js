#!/usr/bin/env node

/**
 * Frontend-Backend Authentication Integration Test
 * Tests the complete authentication flow between React frontend and backend API
 */

import axios from 'axios';

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:8787';

console.log('🧪 Starting Authentication Integration Tests...\n');

// Test data
const testUser = {
  email: `test-integration-${Date.now()}@example.com`,
  password: 'SecureTest123!',
  firstName: 'Integration',
  lastName: 'Test',
  phoneNumber: '+1-555-0199'
};

async function testBackendRegistration() {
  console.log('1️⃣ Testing Backend Registration...');
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/register`, testUser);
    console.log('✅ Backend Registration SUCCESS');
    console.log(`   User ID: ${response.data.data.user.id}`);
    console.log(`   Token: ${response.data.data.token.substring(0, 20)}...`);
    return response.data.data.token;
  } catch (error) {
    console.error('❌ Backend Registration FAILED:', error.response?.data || error.message);
    throw error;
  }
}

async function testBackendLogin() {
  console.log('\n2️⃣ Testing Backend Login...');
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    console.log('✅ Backend Login SUCCESS');
    return response.data.data.token;
  } catch (error) {
    console.error('❌ Backend Login FAILED:', error.response?.data || error.message);
    throw error;
  }
}

async function testProtectedEndpoint(token) {
  console.log('\n3️⃣ Testing Protected Endpoint...');
  try {
    const response = await axios.get(`${BACKEND_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Protected Endpoint SUCCESS');
    console.log(`   User: ${response.data.data.user.email}`);
    console.log(`   PAWS Balance: ${response.data.data.user.paws_balance}`);
  } catch (error) {
    console.error('❌ Protected Endpoint FAILED:', error.response?.data || error.message);
    throw error;
  }
}

async function testFrontendConnection() {
  console.log('\n4️⃣ Testing Frontend Server Connection...');
  try {
    const response = await axios.get(FRONTEND_URL, { timeout: 5000 });
    console.log('✅ Frontend Server ACCESSIBLE');
    console.log(`   Status: ${response.status}`);
  } catch (error) {
    console.error('❌ Frontend Server CONNECTION FAILED');
    console.error(`   Error: ${error.code || error.message}`);
    throw error;
  }
}

async function testLogout(token) {
  console.log('\n5️⃣ Testing Backend Logout...');
  try {
    const response = await axios.post(`${BACKEND_URL}/api/auth/logout`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Backend Logout SUCCESS');
  } catch (error) {
    console.error('❌ Backend Logout FAILED:', error.response?.data || error.message);
    throw error;
  }
}

async function runIntegrationTests() {
  try {
    // Test backend endpoints
    const registrationToken = await testBackendRegistration();
    const loginToken = await testBackendLogin();
    await testProtectedEndpoint(loginToken);
    await testLogout(loginToken);
    
    // Test frontend connection
    await testFrontendConnection();
    
    console.log('\n🎉 ALL INTEGRATION TESTS PASSED!');
    console.log('\n📋 Test Summary:');
    console.log('   ✅ Backend Registration');
    console.log('   ✅ Backend Login'); 
    console.log('   ✅ JWT Token Validation');
    console.log('   ✅ Protected Endpoint Access');
    console.log('   ✅ Backend Logout');
    console.log('   ✅ Frontend Server Connection');
    
    console.log('\n🔗 Ready for End-to-End Testing:');
    console.log(`   Frontend: ${FRONTEND_URL}`);
    console.log(`   Backend: ${BACKEND_URL}`);
    console.log(`   Test User: ${testUser.email}`);
    
  } catch (error) {
    console.log('\n💥 INTEGRATION TESTS FAILED');
    process.exit(1);
  }
}

// Handle errors gracefully
process.on('unhandledRejection', (error) => {
  console.error('\n💥 Unhandled Promise Rejection:', error.message);
  process.exit(1);
});

runIntegrationTests();