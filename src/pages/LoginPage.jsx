import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  const navigate = useNavigate();
  const { error } = useAuth();

  const handleLoginSuccess = () => {
    // Redirect to the originally intended page or dashboard
    const from = location.state?.from?.pathname || '/dashboard';
    navigate(from, { replace: true });
  };

  const handleSwitchToRegister = () => {
    navigate('/auth/register');
  };

  return (
    <div className="space-y-8">
      {/* Global Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Login Form */}
      <LoginForm 
        onSuccess={handleLoginSuccess}
        onSwitchToRegister={handleSwitchToRegister}
      />

      {/* Additional Links */}
      <div className="text-center space-y-4">
        <div className="text-sm text-gray-600">
          <Link 
            to="/auth/forgot-password"
            className="text-emerald-600 hover:text-emerald-500 font-medium"
          >
            Forgot your password?
          </Link>
        </div>
        
        <div className="text-sm text-gray-600">
          Need help? {' '}
          <Link 
            to="/support"
            className="text-emerald-600 hover:text-emerald-500 font-medium"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg p-6 border border-emerald-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">Why Join Rawgle?</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            Find verified raw pet food suppliers near you
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            Earn reward points on every purchase
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            Access exclusive discounts and deals
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            Get personalized pet nutrition advice
          </li>
          <li className="flex items-center gap-2">
            <span className="text-emerald-600">✓</span>
            Connect with the raw feeding community
          </li>
        </ul>
      </div>
    </div>
  );
};

export default LoginPage;