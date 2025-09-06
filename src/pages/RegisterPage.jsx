import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { error } = useAuth();

  const handleRegisterSuccess = () => {
    // Redirect to dashboard after successful registration
    navigate('/dashboard', { replace: true });
  };

  const handleSwitchToLogin = () => {
    navigate('/auth/login');
  };

  return (
    <div className="space-y-8">
      {/* Global Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Register Form */}
      <RegisterForm 
        onSuccess={handleRegisterSuccess}
        onSwitchToLogin={handleSwitchToLogin}
      />

      {/* Terms and Privacy Notice */}
      <div className="text-xs text-gray-500 text-center leading-relaxed">
        By creating an account, you agree to our{' '}
        <Link to="/terms" className="text-emerald-600 hover:text-emerald-500 underline">
          Terms of Service
        </Link>{' '}
        and acknowledge that you have read our{' '}
        <Link to="/privacy" className="text-emerald-600 hover:text-emerald-500 underline">
          Privacy Policy
        </Link>
        . We use your information to provide and improve our services.
      </div>

      {/* Welcome Benefits */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
        <div className="text-center">
          <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-3">
            <span className="text-white text-2xl">🎉</span>
          </div>
          <h3 className="text-lg font-semibold text-amber-900 mb-2">Welcome Bonus!</h3>
          <p className="text-amber-800 text-sm mb-4">
            Get 100 reward points when you complete your registration
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-amber-700">
            <div className="flex items-center gap-2">
              <span className="text-amber-600">🐾</span>
              <span>100 welcome points</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600">⭐</span>
              <span>Access to exclusive deals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600">🏆</span>
              <span>Priority customer support</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-amber-600">💬</span>
              <span>AI nutrition consultation</span>
            </div>
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="text-center text-sm text-gray-600">
        Need help? {' '}
        <Link 
          to="/support"
          className="text-emerald-600 hover:text-emerald-500 font-medium"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
};

export default RegisterPage;