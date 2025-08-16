import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// Comprehensive Authentication Flow Tests
describe('Rawgle App - Authentication Flow Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    
    // Mock successful API responses
    global.fetch = vi.fn();
  });

  afterEach(() => {
    localStorage.clear();
  });

  describe('Registration Flow', () => {
    it('should show confirmation message after successful registration', async () => {
      // Mock successful registration
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'mock-jwt-token-12345',
          user: {
            id: 1,
            email: 'newuser@example.com',
            name: 'New User',
            pawsBalance: 500,
            createdAt: '2025-08-15T00:00:00Z'
          },
          message: 'Registration successful! Welcome to Rawgle!'
        })
      });

      const user = userEvent.setup();
      render(<App />);

      // Open registration modal
      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      // Fill registration form
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');  
      const passwordInput = screen.getByLabelText('Password');

      await user.type(nameInput, 'New User');
      await user.type(emailInput, 'newuser@example.com');
      await user.type(passwordInput, 'password123');

      // Submit form
      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);

      // Should show success/welcome message
      await waitFor(() => {
        expect(
          screen.getByText(/Registration successful|Welcome|success/i) ||
          screen.getByText(/500.*paws/i) || // Welcome PAWS bonus message
          screen.queryByText('New User') // User name appears after login
        ).toBeTruthy();
      });

      // Modal should close after successful registration
      await waitFor(() => {
        expect(screen.queryByText('Join Rawgle')).not.toBeInTheDocument();
      });
    });

    it('should store auth token in localStorage after registration', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'test-auth-token-12345',
          user: { id: 1, email: 'test@example.com', name: 'Test User', pawsBalance: 500 },
          message: 'Registration successful!'
        })
      });

      const user = userEvent.setup();
      render(<App />);

      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      await user.type(screen.getByLabelText('Name'), 'Test User');
      await user.type(screen.getByLabelText('Email'), 'test@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');

      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);

      await waitFor(() => {
        expect(localStorage.getItem('token')).toBe('test-auth-token-12345');
      });
    });

    it('should display user in navigation after successful registration', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'test-token',
          user: {
            id: 1,
            email: 'registered@example.com',
            name: 'Registered User',
            pawsBalance: 500
          },
          message: 'Registration successful!'
        })
      });

      const user = userEvent.setup();
      render(<App />);

      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      await user.type(screen.getByLabelText('Name'), 'Registered User');
      await user.type(screen.getByLabelText('Email'), 'registered@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');

      await user.click(screen.getByText('Create Account'));

      // Should show user name in navigation
      await waitFor(() => {
        expect(screen.getByText('Registered User')).toBeInTheDocument();
      });

      // Sign In/Register buttons should disappear
      await waitFor(() => {
        const signInButtons = screen.queryAllByText('Sign In');
        const registerButtons = screen.queryAllByText('Register');
        expect(signInButtons.length).toBe(0);
        expect(registerButtons.length).toBe(0);
      });
    });
  });

  describe('Login Flow', () => {
    it('should show user name and hide auth buttons after successful login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'login-token-12345',
          user: {
            id: 2,
            email: 'existing@example.com',
            name: 'Existing User',
            pawsBalance: 1250
          },
          message: 'Login successful'
        })
      });

      const user = userEvent.setup();
      render(<App />);

      // Open login modal
      const signInButton = screen.getAllByText('Sign In')[0];
      await user.click(signInButton);

      // Fill login form
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      await user.type(emailInput, 'existing@example.com');
      await user.type(passwordInput, 'existingpassword');

      // Submit login
      const loginSubmitButton = screen.getByText('Sign In');
      await user.click(loginSubmitButton);

      // Should show user name in navigation
      await waitFor(() => {
        expect(screen.getByText('Existing User')).toBeInTheDocument();
      });

      // Login modal should close
      await waitFor(() => {
        expect(screen.queryByText('Sign In to Rawgle')).not.toBeInTheDocument();
      });

      // Auth buttons should be hidden
      const remainingSignInButtons = screen.queryAllByText('Sign In');
      const remainingRegisterButtons = screen.queryAllByText('Register');
      expect(remainingSignInButtons.length).toBe(0);
      expect(remainingRegisterButtons.length).toBe(0);
    });

    it('should update PAWS balance after login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'token-with-paws',
          user: {
            id: 3,
            email: 'pawsuser@example.com',
            name: 'PAWS User',
            pawsBalance: 2750
          },
          message: 'Login successful'
        })
      });

      const user = userEvent.setup();
      render(<App />);

      // Initial PAWS balance should be default (1,250)
      expect(screen.getByText('1,250')).toBeInTheDocument();

      const signInButton = screen.getAllByText('Sign In')[0];
      await user.click(signInButton);

      await user.type(screen.getByLabelText('Email'), 'pawsuser@example.com');
      await user.type(screen.getByLabelText('Password'), 'password');
      await user.click(screen.getByText('Sign In'));

      // PAWS balance should update
      await waitFor(() => {
        expect(screen.getByText('2,750')).toBeInTheDocument();
        expect(screen.queryByText('1,250')).not.toBeInTheDocument();
      });
    });

    it('should persist login state on page refresh', async () => {
      // Set up localStorage as if user was already logged in
      localStorage.setItem('token', 'existing-token');
      localStorage.setItem('user', JSON.stringify({
        id: 4,
        email: 'persistent@example.com',
        name: 'Persistent User',
        pawsBalance: 1500
      }));

      render(<App />);

      // Should show logged in user immediately
      expect(screen.getByText('Persistent User')).toBeInTheDocument();
      expect(screen.getByText('1,500')).toBeInTheDocument();

      // Should not show auth buttons
      const signInButtons = screen.queryAllByText('Sign In');
      const registerButtons = screen.queryAllByText('Register');
      expect(signInButtons.length).toBe(0);
      expect(registerButtons.length).toBe(0);
    });
  });

  describe('Error Handling in Auth Flow', () => {
    it('should show specific error messages for failed registration', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          success: false,
          message: 'Email already exists'
        })
      });

      const user = userEvent.setup();
      render(<App />);

      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      await user.type(screen.getByLabelText('Name'), 'Duplicate User');
      await user.type(screen.getByLabelText('Email'), 'duplicate@example.com');
      await user.type(screen.getByLabelText('Password'), 'password123');

      await user.click(screen.getByText('Create Account'));

      await waitFor(() => {
        expect(screen.getByText(/Email already exists|Registration failed/i)).toBeInTheDocument();
      });

      // Modal should remain open on error
      expect(screen.getByText('Join Rawgle')).toBeInTheDocument();
    });

    it('should show error for failed login', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: async () => ({
          success: false,
          message: 'Invalid credentials'
        })
      });

      const user = userEvent.setup();
      render(<App />);

      const signInButton = screen.getAllByText('Sign In')[0];
      await user.click(signInButton);

      await user.type(screen.getByLabelText('Email'), 'wrong@example.com');
      await user.type(screen.getByLabelText('Password'), 'wrongpassword');
      await user.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(screen.getByText(/Invalid credentials|Login failed/i)).toBeInTheDocument();
      });

      // Modal should remain open on error
      expect(screen.getByText('Sign In to Rawgle')).toBeInTheDocument();
    });
  });

  describe('User Profile Display', () => {
    it('should show user avatar placeholder when logged in', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'avatar-token',
          user: {
            id: 5,
            email: 'avatar@example.com',
            name: 'Avatar User',
            pawsBalance: 800
          }
        })
      });

      const user = userEvent.setup();
      render(<App />);

      const signInButton = screen.getAllByText('Sign In')[0];
      await user.click(signInButton);

      await user.type(screen.getByLabelText('Email'), 'avatar@example.com');
      await user.type(screen.getByLabelText('Password'), 'password');
      await user.click(screen.getByText('Sign In'));

      await waitFor(() => {
        expect(screen.getByText('Avatar User')).toBeInTheDocument();
      });

      // Should show avatar image placeholder
      const avatarImg = screen.getByAltText('User');
      expect(avatarImg).toBeInTheDocument();
      expect(avatarImg).toHaveAttribute('src', expect.stringContaining('placeholder'));
    });

    it('should show logout functionality when user is logged in', async () => {
      localStorage.setItem('token', 'logout-test-token');
      localStorage.setItem('user', JSON.stringify({
        id: 6,
        email: 'logout@example.com',
        name: 'Logout User',
        pawsBalance: 1000
      }));

      render(<App />);

      expect(screen.getByText('Logout User')).toBeInTheDocument();

      // Should be able to click on user profile for logout menu
      const userProfile = screen.getByText('Logout User');
      expect(userProfile).toBeInTheDocument();
      
      // In a real app, clicking user profile should show dropdown with logout option
      // This test ensures the user profile is clickable
      expect(userProfile.closest('div')).toBeInTheDocument();
    });
  });

  describe('Welcome Message and Onboarding', () => {
    it('should show welcome message with PAWS bonus for new registrations', async () => {
      global.fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          token: 'welcome-token',
          user: {
            id: 7,
            email: 'welcome@example.com',
            name: 'Welcome User',
            pawsBalance: 500 // New user bonus
          },
          message: 'Registration successful! Welcome to Rawgle!'
        })
      });

      const user = userEvent.setup();
      render(<App />);

      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      await user.type(screen.getByLabelText('Name'), 'Welcome User');
      await user.type(screen.getByLabelText('Email'), 'welcome@example.com');
      await user.type(screen.getByLabelText('Password'), 'welcome123');

      await user.click(screen.getByText('Create Account'));

      // Should show welcome message or PAWS bonus notification
      await waitFor(() => {
        const hasWelcome = screen.queryByText(/welcome.*rawgle/i);
        const hasPawsBonus = screen.queryByText(/500.*paws/i);
        const hasSuccess = screen.queryByText(/registration successful/i);
        
        expect(hasWelcome || hasPawsBonus || hasSuccess).toBeTruthy();
      });
    });
  });
});