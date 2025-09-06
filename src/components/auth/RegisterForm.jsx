import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, User, Phone, AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { registrationSchema } from '../../utils/validation';

const RegisterForm = ({ onSuccess, onSwitchToLogin }) => {
  const { register: registerUser, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setError,
  } = useForm({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
      agreeToTerms: false,
    },
  });

  const password = watch('password');

  const onSubmit = async (data) => {
    clearError();
    
    const result = await registerUser({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phoneNumber,
    });
    
    if (result.success) {
      onSuccess?.();
    } else {
      // Handle specific error types
      if (result.error?.includes('email')) {
        setError('email', { message: result.error });
      }
    }
  };

  // Enhanced password strength indicator with requirements
  const getPasswordStrength = (password) => {
    if (!password) return { 
      strength: 0, 
      label: '', 
      percentage: 0,
      requirements: {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        special: false
      }
    };
    
    const requirements = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };
    
    const metRequirements = Object.values(requirements).filter(Boolean).length;
    let label = 'Very Weak';
    let colorClass = 'bg-red-500';
    
    if (metRequirements === 5) {
      label = 'Strong';
      colorClass = 'bg-green-500';
    } else if (metRequirements === 4) {
      label = 'Good';
      colorClass = 'bg-green-400';
    } else if (metRequirements === 3) {
      label = 'Fair';
      colorClass = 'bg-yellow-500';
    } else if (metRequirements >= 2) {
      label = 'Weak';
      colorClass = 'bg-orange-500';
    }
    
    return { 
      strength: metRequirements, 
      label,
      colorClass,
      percentage: (metRequirements / 5) * 100,
      requirements 
    };
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-10">
        {/* Header Design - Pixel Perfect */}
        <div className="text-center mb-8">
          <h1 className="font-bold text-2xl leading-8 text-gray-900 mb-4" style={{ fontFamily: 'Poppins' }}>
            Join the Raw Feeding Community
          </h1>
          <p className="text-base leading-6 text-gray-600 mb-8" style={{ fontFamily: 'Inter' }}>
            Start your pet's raw feeding journey today
          </p>
        </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('firstName')}
                type="text"
                placeholder="First name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                  errors.firstName 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-white'
                }`}
                autoComplete="given-name"
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Last Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register('lastName')}
                type="text"
                placeholder="Last name"
                className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                  errors.lastName 
                    ? 'border-red-300 bg-red-50' 
                    : 'border-gray-300 bg-white'
                }`}
                autoComplete="family-name"
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
            )}
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('email')}
              type="email"
              placeholder="Enter your email"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.email 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white'
              }`}
              autoComplete="email"
            />
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Phone Field (Optional) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Phone Number <span className="text-gray-500">(optional)</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('phoneNumber')}
              type="tel"
              placeholder="Enter your phone number"
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.phoneNumber 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white'
              }`}
              autoComplete="tel"
            />
          </div>
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-600">{errors.phoneNumber.message}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Create a password"
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.password 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white'
              }`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          
          {password && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">Password strength:</span>
                <span className={`font-medium ${
                  passwordStrength.strength >= 3 ? 'text-green-600' : 
                  passwordStrength.strength >= 2 ? 'text-yellow-600' : 'text-red-600'
                }`}>
                  {passwordStrength.label}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    passwordStrength.strength >= 3 ? 'bg-green-500' : 
                    passwordStrength.strength >= 2 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${(passwordStrength.strength / 4) * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-gray-400" />
            </div>
            <input
              {...register('confirmPassword')}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm your password"
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
                errors.confirmPassword 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white'
              }`}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms Agreement */}
        <div>
          <div className="flex items-center">
            <input
              {...register('agreeToTerms')}
              type="checkbox"
              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
            />
            <label className="ml-2 text-sm text-gray-700">
              I agree to the{' '}
              <a href="/terms" className="text-emerald-600 hover:text-emerald-500 font-medium">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-emerald-600 hover:text-emerald-500 font-medium">
                Privacy Policy
              </a>
            </label>
          </div>
          {errors.agreeToTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.agreeToTerms.message}</p>
          )}
        </div>

        {/* Welcome Bonus Info */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-amber-600" />
            <div>
              <p className="font-medium text-amber-900">Welcome Bonus!</p>
              <p className="text-sm text-amber-700">Get 100 reward points when you create your account</p>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || isSubmitting}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          {loading || isSubmitting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating account...
            </div>
          ) : (
            'Create Account'
          )}
        </button>

        {/* Sign In Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-emerald-600 hover:text-emerald-500 font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
      </div>
    </div>
  );
};

export default RegisterForm;