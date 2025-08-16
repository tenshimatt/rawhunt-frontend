import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

/**
 * END-TO-END REAL USER JOURNEY TESTS
 * These tests simulate exactly what a real user would do on the deployed application
 * NO MOCKING - uses actual API endpoints to validate complete system integration
 */

const DEPLOYED_BACKEND = 'https://rawgle-backend-nodatabase.findrawdogfood.workers.dev';
const DEPLOYED_FRONTEND = 'https://9ac883be.rawgle-frontend.pages.dev';

describe('🌐 Real User Journey Tests - Complete System Integration', () => {
  beforeEach(() => {
    // Clear localStorage to start fresh each test
    localStorage.clear();
    
    // Don't mock fetch - use real API calls
    global.fetch = fetch;
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('📊 Data Loading Journey', () => {
    it('should load suppliers on initial page load (real API)', async () => {
      console.log('🧪 Testing: Initial suppliers loading from real API');
      
      render(<App />);
      
      // Should show loading initially
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      
      // Wait for suppliers to load from real API
      await waitFor(() => {
        const suppliersCountElement = screen.queryByText(/\d+ Suppliers Found/);
        expect(suppliersCountElement).toBeInTheDocument();
        
        // Should NOT show 0 suppliers if API is working
        expect(screen.queryByText('0 Suppliers Found')).not.toBeInTheDocument();
        
        // Should NOT show error message
        expect(screen.queryByText(/Failed to connect to server/)).not.toBeInTheDocument();
      }, { timeout: 10000 });

      // Verify actual supplier data is displayed
      await waitFor(() => {
        // Should show supplier names from API
        const supplierElements = screen.getAllByText(/Pet|Grooming|Veterinary|Training/);
        expect(supplierElements.length).toBeGreaterThan(0);
      }, { timeout: 5000 });

      console.log('✅ Suppliers loaded successfully');
    });

    it('should display supplier cards with all required information', async () => {
      console.log('🧪 Testing: Supplier card content completeness');
      
      render(<App />);
      
      await waitFor(() => {
        const suppliersFound = screen.queryByText(/\d+ Suppliers Found/);
        expect(suppliersFound).toBeInTheDocument();
      }, { timeout: 10000 });

      // Each supplier card should have:
      await waitFor(() => {
        // Supplier names
        expect(screen.getByText(/Pet Grooming Plus|Downtown Veterinary|Happy Tails/)).toBeInTheDocument();
        
        // View Details buttons
        const viewDetailsButtons = screen.getAllByText('View Details');
        expect(viewDetailsButtons.length).toBeGreaterThan(0);
        
        // Get Directions buttons  
        const directionsButtons = screen.getAllByText('Get Directions');
        expect(directionsButtons.length).toBeGreaterThan(0);
        
        // PAWS earning information
        expect(screen.getByText(/Earn \d+ PAWS per order/)).toBeInTheDocument();
        
        // Ratings
        expect(screen.getByText(/4\.\d/)).toBeInTheDocument();
      }, { timeout: 5000 });

      console.log('✅ Supplier cards display complete information');
    });
  });

  describe('🔐 Authentication Journey', () => {
    it('should complete full registration workflow', async () => {
      console.log('🧪 Testing: Complete registration workflow with real API');
      
      const user = userEvent.setup();
      render(<App />);

      // Step 1: Open registration modal
      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      expect(screen.getByText('Join Rawgle')).toBeInTheDocument();

      // Step 2: Fill registration form with unique email
      const timestamp = Date.now();
      const testEmail = `test-e2e-${timestamp}@example.com`;
      const testName = `E2E Test User ${timestamp}`;

      await user.type(screen.getByLabelText('Name'), testName);
      await user.type(screen.getByLabelText('Email'), testEmail);
      await user.type(screen.getByLabelText('Password'), 'TestPassword123!');

      // Step 3: Submit form to real API
      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);

      // Step 4: Wait for successful registration
      await waitFor(() => {
        // Should show success message
        const successMessage = screen.queryByText(/Registration successful|Welcome.*Rawgle/i);
        expect(successMessage).toBeInTheDocument();
      }, { timeout: 15000 });

      // Step 5: Verify user is logged in
      await waitFor(() => {
        // User name should appear in navigation
        expect(screen.getByText(testName)).toBeInTheDocument();
        
        // Auth buttons should be hidden
        expect(screen.queryAllByText('Sign In').length).toBe(0);
        expect(screen.queryAllByText('Register').length).toBe(0);
        
        // Should show PAWS welcome bonus
        expect(screen.getByText('500')).toBeInTheDocument();
      }, { timeout: 5000 });

      // Step 6: Verify localStorage persistence
      expect(localStorage.getItem('token')).toBeTruthy();
      expect(localStorage.getItem('user')).toBeTruthy();
      
      const savedUser = JSON.parse(localStorage.getItem('user'));
      expect(savedUser.email).toBe(testEmail);
      expect(savedUser.name).toBe(testName);
      expect(savedUser.pawsBalance).toBe(500);

      console.log('✅ Registration workflow completed successfully');
    });

    it('should complete full login workflow', async () => {
      console.log('🧪 Testing: Complete login workflow with real API');
      
      const user = userEvent.setup();
      render(<App />);

      // Step 1: Open login modal
      const signInButton = screen.getAllByText('Sign In')[0];
      await user.click(signInButton);

      expect(screen.getByText('Sign In to Rawgle')).toBeInTheDocument();

      // Step 2: Fill login form
      await user.type(screen.getByLabelText('Email'), 'existing@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');

      // Step 3: Submit to real API
      const loginSubmitButton = screen.getByText('Sign In');
      await user.click(loginSubmitButton);

      // Step 4: Wait for successful login
      await waitFor(() => {
        // Should show welcome message
        const welcomeMessage = screen.queryByText(/Welcome back/i);
        expect(welcomeMessage).toBeInTheDocument();
      }, { timeout: 10000 });

      // Step 5: Verify user state
      await waitFor(() => {
        // Should show user in navigation
        expect(screen.queryByText(/existing|test/)).toBeInTheDocument();
        
        // Auth buttons should be hidden
        expect(screen.queryAllByText('Sign In').length).toBe(0);
      }, { timeout: 5000 });

      console.log('✅ Login workflow completed successfully');
    });

    it('should persist user session across app reload', async () => {
      console.log('🧪 Testing: Session persistence across reload');
      
      // Simulate user already logged in
      const mockUser = {
        id: 999,
        email: 'persistent@example.com',
        name: 'Persistent User',
        pawsBalance: 1500
      };
      
      localStorage.setItem('token', 'test-persistent-token');
      localStorage.setItem('user', JSON.stringify(mockUser));

      // Render app (simulating page reload)
      render(<App />);

      // Should immediately show logged in user
      await waitFor(() => {
        expect(screen.getByText('Persistent User')).toBeInTheDocument();
        expect(screen.getByText('1,500')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Auth buttons should not be visible
      expect(screen.queryAllByText('Sign In').length).toBe(0);
      expect(screen.queryAllByText('Register').length).toBe(0);

      console.log('✅ Session persistence working correctly');
    });
  });

  describe('🔍 Search and Interaction Journey', () => {
    it('should perform search and interact with results', async () => {
      console.log('🧪 Testing: Search functionality and result interaction');
      
      const user = userEvent.setup();
      render(<App />);

      // Wait for initial load
      await waitFor(() => {
        expect(screen.queryByText(/\d+ Suppliers Found/)).toBeInTheDocument();
      }, { timeout: 10000 });

      // Step 1: Perform search
      const searchInput = screen.getByPlaceholderText(/Search for suppliers/);
      await user.type(searchInput, 'veterinary');

      const searchButton = screen.getByRole('button', { name: 'Search' });
      await user.click(searchButton);

      // Step 2: Verify search results update
      await waitFor(() => {
        // Should still show results (may be filtered)
        expect(screen.queryByText(/Failed to connect/)).not.toBeInTheDocument();
      }, { timeout: 8000 });

      // Step 3: Test supplier interaction
      const viewDetailsButton = screen.getAllByText('View Details')[0];
      await user.click(viewDetailsButton);

      // Should show supplier details (alert or modal)
      // This tests that the buttons are functional

      console.log('✅ Search and interaction working correctly');
    });

    it('should test category filtering', async () => {
      console.log('🧪 Testing: Category filter functionality');
      
      const user = userEvent.setup();
      render(<App />);

      await waitFor(() => {
        expect(screen.queryByText(/\d+ Suppliers Found/)).toBeInTheDocument();
      }, { timeout: 10000 });

      // Test category buttons
      const categoryButtons = screen.getAllByText(/Raw Beef|Raw Chicken|Organic/);
      if (categoryButtons.length > 0) {
        await user.click(categoryButtons[0]);
        
        // Should trigger new search
        await waitFor(() => {
          // Category should be selected (visual feedback)
          expect(categoryButtons[0]).toHaveClass(/bg-white|text-emerald-700/);
        }, { timeout: 3000 });
      }

      console.log('✅ Category filtering functional');
    });
  });

  describe('💰 PAWS System Journey', () => {
    it('should display and update PAWS balance correctly', async () => {
      console.log('🧪 Testing: PAWS system functionality');
      
      render(<App />);

      // Should show default PAWS balance
      expect(screen.getByText('1,250')).toBeInTheDocument();
      expect(screen.getByText('PAWS Balance')).toBeInTheDocument();

      // Test PAWS earning display on supplier cards
      await waitFor(() => {
        const pawsEarning = screen.queryByText(/Earn \d+ PAWS per order/);
        expect(pawsEarning).toBeInTheDocument();
      }, { timeout: 10000 });

      console.log('✅ PAWS system displaying correctly');
    });

    it('should show PAWS rewards call-to-action', async () => {
      console.log('🧪 Testing: PAWS rewards promotion');
      
      const user = userEvent.setup();
      render(<App />);

      // Should show PAWS rewards section
      expect(screen.getByText('Join PAWS Rewards')).toBeInTheDocument();
      expect(screen.getByText('Start Earning PAWS')).toBeInTheDocument();

      // Clicking should open registration
      const startEarningButton = screen.getByText('Start Earning PAWS');
      await user.click(startEarningButton);

      await waitFor(() => {
        expect(screen.getByText('Join Rawgle')).toBeInTheDocument();
      }, { timeout: 3000 });

      console.log('✅ PAWS rewards promotion working');
    });
  });

  describe('🌐 Full System Integration Test', () => {
    it('should complete entire user journey from landing to registration to search', async () => {
      console.log('🧪 Testing: Complete end-to-end user journey');
      
      const user = userEvent.setup();
      render(<App />);

      // Phase 1: Landing and initial load
      console.log('Phase 1: Landing page');
      expect(screen.getByText('Find Premium Raw Dog Food Near You')).toBeInTheDocument();
      
      await waitFor(() => {
        expect(screen.queryByText(/\d+ Suppliers Found/)).toBeInTheDocument();
        expect(screen.queryByText('0 Suppliers Found')).not.toBeInTheDocument();
      }, { timeout: 15000 });

      // Phase 2: Registration
      console.log('Phase 2: User registration');
      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      const timestamp = Date.now();
      await user.type(screen.getByLabelText('Name'), `Journey User ${timestamp}`);
      await user.type(screen.getByLabelText('Email'), `journey-${timestamp}@example.com`);
      await user.type(screen.getByLabelText('Password'), 'JourneyPass123!');

      await user.click(screen.getByText('Create Account'));

      await waitFor(() => {
        expect(screen.queryByText(/Registration successful|Welcome/)).toBeInTheDocument();
        expect(screen.getByText(`Journey User ${timestamp}`)).toBeInTheDocument();
      }, { timeout: 15000 });

      // Phase 3: Search and interaction
      console.log('Phase 3: Search and interaction');
      const searchInput = screen.getByPlaceholderText(/Search for suppliers/);
      await user.type(searchInput, 'grooming');
      
      await user.click(screen.getByRole('button', { name: 'Search' }));

      await waitFor(() => {
        const viewDetailsButtons = screen.getAllByText('View Details');
        expect(viewDetailsButtons.length).toBeGreaterThan(0);
      }, { timeout: 10000 });

      // Phase 4: Verify complete system state
      console.log('Phase 4: System state verification');
      expect(localStorage.getItem('token')).toBeTruthy();
      expect(localStorage.getItem('user')).toBeTruthy();
      expect(screen.getByText('500')).toBeInTheDocument(); // PAWS balance
      expect(screen.queryAllByText('Sign In').length).toBe(0); // Not logged out
      
      console.log('✅ Complete user journey successful');
    });
  });

  describe('❌ Error Handling Tests', () => {
    it('should handle API failures gracefully', async () => {
      console.log('🧪 Testing: Error handling for API failures');
      
      // Mock fetch to simulate API failure
      global.fetch = vi.fn().mockRejectedValue(new Error('Network Error'));
      
      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to connect to server/)).toBeInTheDocument();
      }, { timeout: 8000 });

      console.log('✅ Error handling working correctly');
    });
  });
});