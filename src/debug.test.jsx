import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import App from './App';

describe('Debug Authentication', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('should debug registration flow step by step', async () => {
    console.log('=== Starting Registration Debug Test ===');
    
    // Mock successful registration response
    const mockUser = {
      id: 999,
      email: 'debug@example.com',
      name: 'Debug User',
      pawsBalance: 500,
      createdAt: '2025-08-15T00:00:00Z'
    };

    global.fetch = vi.fn()
      // First call - suppliers API (initial load)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { suppliers: [] }
        })
      })
      // Second call - registration API
      .mockResolvedValueOnce({
        ok: true,
        status: 201,
        json: async () => ({
          success: true,
          token: 'debug-token-12345',
          user: mockUser,
          message: 'Registration successful! Welcome to Rawgle!'
        })
      });

    const user = userEvent.setup();
    render(<App />);

    console.log('1. App rendered');
    
    // Step 1: Open registration modal
    const registerButtons = screen.getAllByText('Register');
    console.log('2. Found register buttons:', registerButtons.length);
    
    await user.click(registerButtons[0]);
    console.log('3. Clicked register button');

    // Check modal opened
    await waitFor(() => {
      expect(screen.getByText('Join Rawgle')).toBeInTheDocument();
    });
    console.log('4. Registration modal opened');

    // Step 2: Fill form
    const nameInput = screen.getByLabelText('Name');
    const emailInput = screen.getByLabelText('Email');
    const passwordInput = screen.getByLabelText('Password');

    await user.type(nameInput, 'Debug User');
    await user.type(emailInput, 'debug@example.com');
    await user.type(passwordInput, 'debugpass123');
    console.log('5. Form filled');

    // Step 3: Submit
    const submitButton = screen.getByText('Create Account');
    await user.click(submitButton);
    console.log('6. Form submitted');

    // Step 4: Wait for API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled();
    }, { timeout: 3000 });
    console.log('7. API called');

    // Check what was called
    console.log('8. Fetch calls made:', global.fetch.mock.calls.length);
    global.fetch.mock.calls.forEach((call, index) => {
      console.log(`   Call ${index}:`, call[0]);
      if (call[1] && call[1].body) {
        console.log(`   Body ${index}:`, JSON.parse(call[1].body));
      }
    });

    // Step 5: Check for success indicators with more time
    await waitFor(() => {
      // Look for any sign of success
      const successMessage = screen.queryByText(/Registration successful|Welcome|Debug User/);
      const userInNav = screen.queryByText('Debug User');
      const pawsUpdate = screen.queryByText('500');
      const hiddenAuthButtons = screen.queryAllByText('Register').length === 0;
      
      console.log('9. Success indicators:');
      console.log('   - Success message:', !!successMessage);
      console.log('   - User in nav:', !!userInNav);  
      console.log('   - PAWS updated:', !!pawsUpdate);
      console.log('   - Auth buttons hidden:', hiddenAuthButtons);
      console.log('   - LocalStorage token:', localStorage.getItem('token'));
      console.log('   - LocalStorage user:', localStorage.getItem('user'));

      // Success should show user in navigation AND localStorage should be set
      expect(userInNav).toBeTruthy();
      expect(localStorage.getItem('token')).toBe('debug-token-12345');
      expect(localStorage.getItem('user')).toBeTruthy();
    }, { timeout: 8000 });

    console.log('=== Registration Debug Complete ===');
  });
});