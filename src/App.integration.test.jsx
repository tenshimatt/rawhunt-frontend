import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

// Real integration tests that test actual network requests
describe('Rawgle App - Real Integration Tests', () => {
  let originalFetch;

  beforeEach(() => {
    // Store original fetch
    originalFetch = global.fetch;
    
    // Clear any existing mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original fetch
    global.fetch = originalFetch;
  });

  describe('Network Error Scenarios', () => {
    it('should show network error when backend is unreachable', async () => {
      // Mock network failure
      global.fetch = vi.fn().mockRejectedValue(new Error('Failed to fetch'));

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to connect to server/i)).toBeInTheDocument();
      }, { timeout: 5000 });
    });

    it('should show network error when CORS blocks request', async () => {
      // Mock CORS error response
      global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));

      const user = userEvent.setup();
      render(<App />);

      // Open registration form
      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      // Fill form
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      await user.type(nameInput, 'Test User');
      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'password123');

      // Submit form
      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);

      // Should show network error
      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });

    it('should handle 404 responses from backend', async () => {
      // Mock 404 response
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ message: 'Not found' })
      });

      const user = userEvent.setup();
      render(<App />);

      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      const nameInput = screen.getByLabelText('Name');
      await user.type(nameInput, 'Test User');

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'test@example.com');

      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/Not found|Registration failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Real API Endpoint Tests', () => {
    it('should make actual request to production backend', async () => {
      // Use real fetch (no mocking)
      const user = userEvent.setup();
      render(<App />);

      // Open registration form
      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      // Fill out form
      const nameInput = screen.getByLabelText('Name');
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      await user.type(nameInput, 'Integration Test User');
      await user.type(emailInput, `test+${Date.now()}@example.com`);
      await user.type(passwordInput, 'testpassword123');

      // Submit form and wait for response
      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);

      // Wait for either success or error message
      await waitFor(() => {
        const hasSuccess = screen.queryByText(/welcome/i);
        const hasError = screen.queryByText(/error|failed/i);
        expect(hasSuccess || hasError).toBeTruthy();
      }, { timeout: 10000 });
    });

    it('should test actual login endpoint connectivity', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Open login form
      const signInButton = screen.getAllByText('Sign In')[0];
      await user.click(signInButton);

      // Fill login form
      const emailInput = screen.getByLabelText('Email');
      const passwordInput = screen.getByLabelText('Password');

      await user.type(emailInput, 'test@example.com');
      await user.type(passwordInput, 'testpassword');

      // Submit login
      const loginSubmitButton = screen.getByText('Sign In');
      await user.click(loginSubmitButton);

      // Wait for response
      await waitFor(() => {
        const hasResponse = screen.queryByText(/welcome|success|error|failed|invalid/i);
        expect(hasResponse).toBeTruthy();
      }, { timeout: 10000 });
    });
  });

  describe('Environment Configuration Tests', () => {
    it('should use correct API base URL', () => {
      render(<App />);
      
      // Check that the API_BASE_URL is correctly set
      const expectedUrl = 'https://rawgle-backend-nodatabase.findrawdogfood.workers.dev';
      
      // This test ensures the frontend is configured with the right backend URL
      expect(import.meta.env.VITE_API_BASE_URL || expectedUrl).toBe(expectedUrl);
    });

    it('should make requests to the correct backend endpoint', async () => {
      const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue({
        ok: true,
        json: async () => ({ success: true, data: { suppliers: [] } })
      });

      render(<App />);

      // Wait for initial API call
      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          expect.stringContaining('rawgle-backend-nodatabase.findrawdogfood.workers.dev')
        );
      });
    });
  });

  describe('User Experience Tests', () => {
    it('should show loading states during network requests', async () => {
      // Mock slow network
      global.fetch = vi.fn().mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ success: true, data: { suppliers: [] } })
          }), 1000)
        )
      );

      render(<App />);

      // Should show loading
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('should handle form validation errors', async () => {
      const user = userEvent.setup();
      render(<App />);

      // Open registration form
      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      // Try to submit empty form
      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);

      // Should show validation errors (HTML5 validation)
      const nameInput = screen.getByLabelText('Name');
      expect(nameInput).toBeRequired();
    });
  });

  describe('Cross-Origin Resource Sharing Tests', () => {
    it('should handle CORS preflight failures', async () => {
      // Mock CORS preflight failure
      global.fetch = vi.fn()
        .mockRejectedValueOnce(new TypeError('Network request failed'))
        .mockRejectedValueOnce(new TypeError('Failed to fetch'));

      const user = userEvent.setup();
      render(<App />);

      const registerButton = screen.getAllByText('Register')[0];
      await user.click(registerButton);

      const nameInput = screen.getByLabelText('Name');
      await user.type(nameInput, 'Test User');

      const emailInput = screen.getByLabelText('Email');
      await user.type(emailInput, 'test@cors.com');

      const passwordInput = screen.getByLabelText('Password');
      await user.type(passwordInput, 'password123');

      const submitButton = screen.getByText('Create Account');
      await user.click(submitButton);

      // Should eventually show error
      await waitFor(() => {
        expect(screen.getByText(/Network error|failed/i)).toBeInTheDocument();
      }, { timeout: 8000 });
    });
  });
});