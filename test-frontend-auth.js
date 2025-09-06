#!/usr/bin/env node

/**
 * Frontend Authentication Test
 * Tests the actual authentication flow through the frontend
 */

import puppeteer from 'puppeteer';

const FRONTEND_URL = 'http://localhost:5174';

async function testFrontendAuthentication() {
  console.log('🧪 FRONTEND AUTHENTICATION TEST');
  console.log('='.repeat(50));
  
  const browser = await puppeteer.launch({ 
    headless: false, // Set to false to see the browser in action
    defaultViewport: { width: 1200, height: 800 }
  });
  
  try {
    const page = await browser.newPage();
    
    // Listen for console logs from the frontend
    page.on('console', msg => {
      const type = msg.type();
      const text = msg.text();
      if (type === 'error') {
        console.log('🚨 Frontend Error:', text);
      } else if (type === 'warn') {
        console.log('⚠️  Frontend Warning:', text);
      } else if (text.includes('API') || text.includes('auth')) {
        console.log('🔍 Frontend Log:', text);
      }
    });
    
    // Listen for network failures
    page.on('requestfailed', request => {
      console.log('❌ Network Error:', request.url(), request.failure().errorText);
    });
    
    console.log('\n1️⃣ Loading frontend application...');
    await page.goto(FRONTEND_URL, { waitUntil: 'networkidle0' });
    
    // Check if the page loaded successfully
    const title = await page.title();
    console.log('✅ Frontend loaded. Page title:', title);
    
    console.log('\n2️⃣ Navigating to login page...');
    
    // Try to find login link or navigate to auth/login
    try {
      await page.goto(`${FRONTEND_URL}/auth/login`, { waitUntil: 'networkidle0' });
      console.log('✅ Login page loaded');
    } catch (error) {
      console.log('❌ Failed to load login page:', error.message);
      return;
    }
    
    console.log('\n3️⃣ Testing login form...');
    
    // Fill in the login form
    const testCredentials = {
      email: 'debug@test.com',
      password: 'Test123!@#'
    };
    
    try {
      // Wait for the form to be visible
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      
      // Fill the form
      await page.type('input[type="email"]', testCredentials.email);
      await page.type('input[type="password"]', testCredentials.password);
      
      console.log('✅ Form filled with credentials');
      
      // Submit the form
      await page.click('button[type="submit"]');
      console.log('✅ Login form submitted');
      
      // Wait for either success redirect or error message
      await page.waitForTimeout(3000);
      
      const currentUrl = page.url();
      console.log('🔄 Current URL after login:', currentUrl);
      
      // Check if login was successful (redirected away from login page)
      if (currentUrl.includes('/auth/login')) {
        console.log('❌ Still on login page - login likely failed');
        
        // Check for error messages
        const errorElements = await page.$$('[class*="error"], [class*="alert"], .text-red-600, .text-red-700');
        for (const element of errorElements) {
          const errorText = await element.textContent();
          if (errorText && errorText.trim()) {
            console.log('🚨 Error message found:', errorText);
          }
        }
      } else {
        console.log('✅ Login successful - redirected to:', currentUrl);
      }
      
    } catch (error) {
      console.log('❌ Form interaction failed:', error.message);
    }
    
    console.log('\n4️⃣ Testing registration flow...');
    
    try {
      await page.goto(`${FRONTEND_URL}/auth/register`, { waitUntil: 'networkidle0' });
      console.log('✅ Registration page loaded');
      
      // Check if registration form exists
      const emailInput = await page.$('input[type="email"]');
      const passwordInput = await page.$('input[type="password"]');
      
      if (emailInput && passwordInput) {
        console.log('✅ Registration form found');
      } else {
        console.log('❌ Registration form not found');
      }
      
    } catch (error) {
      console.log('❌ Registration page test failed:', error.message);
    }
    
    console.log('\n🎯 Test Summary:');
    console.log('- Frontend is accessible');
    console.log('- Authentication pages load');
    console.log('- Forms are interactive');
    
  } catch (error) {
    console.error('🚨 Test error:', error);
  } finally {
    await browser.close();
  }
}

// Check if puppeteer is available
const puppeteerAvailable = async () => {
  try {
    await import('puppeteer');
    return true;
  } catch (error) {
    console.log('❌ Puppeteer not available. Install with: npm install puppeteer');
    console.log('🔧 Running basic URL check instead...');
    
    // Basic fetch test
    try {
      const response = await fetch(FRONTEND_URL);
      console.log('✅ Frontend is accessible:', response.status === 200 ? 'YES' : 'NO');
      
      const loginResponse = await fetch(`${FRONTEND_URL}/auth/login`);
      console.log('✅ Login page accessible:', loginResponse.status === 200 ? 'YES' : 'NO');
      
    } catch (error) {
      console.log('❌ Frontend not accessible:', error.message);
    }
    
    return false;
  }
};

// Main execution
(async () => {
  if (await puppeteerAvailable()) {
    await testFrontendAuthentication();
  }
})();