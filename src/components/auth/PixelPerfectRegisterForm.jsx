import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { registrationSchema } from '../../utils/validation';

const PixelPerfectRegisterForm = ({ onSuccess, onSwitchToLogin }) => {
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
  const confirmPassword = watch('confirmPassword');

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
      if (result.error?.includes('email')) {
        setError('email', { message: result.error });
      }
    }
  };

  // Enhanced password strength with requirements checklist
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
    let colorClass = '#EF4444'; // red-500
    
    if (metRequirements === 5) {
      label = 'Strong';
      colorClass = '#10B981'; // green-500
    } else if (metRequirements === 4) {
      label = 'Good';
      colorClass = '#22C55E'; // green-400  
    } else if (metRequirements === 3) {
      label = 'Fair';
      colorClass = '#EAB308'; // yellow-500
    } else if (metRequirements >= 2) {
      label = 'Weak';
      colorClass = '#F97316'; // orange-500
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
    <div className="min-h-screen flex items-center justify-center px-4 py-6" style={{ backgroundColor: '#F9FAFB' }}>
      <div 
        className="w-full bg-white rounded-xl p-10"
        style={{ 
          maxWidth: '400px',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          borderRadius: '12px'
        }}
      >
        {/* Header Design - Pixel Perfect */}
        <div className="text-center mb-8">
          <h1 
            className="font-bold mb-4"
            style={{ 
              fontFamily: 'Poppins', 
              fontSize: '24px', 
              lineHeight: '32px',
              color: '#212121',
              marginBottom: '16px'
            }}
          >
            Join the Raw Feeding Community
          </h1>
          <p 
            style={{ 
              fontFamily: 'Inter', 
              fontSize: '16px', 
              lineHeight: '24px',
              color: '#757575',
              marginBottom: '32px'
            }}
          >
            Start your pet's raw feeding journey today
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div 
            className="mb-6 p-4 rounded-lg flex items-center gap-3"
            style={{ 
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA'
            }}
          >
            <AlertTriangle style={{ width: '20px', height: '20px', color: '#EF4444' }} />
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#B91C1C' }}>
              {error}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Email Field - Pixel Perfect Implementation */}
          <div style={{ marginBottom: '24px' }}>
            <label 
              style={{ 
                fontFamily: 'Inter', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374B5C',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('email')}
                type="email"
                inputMode="email"
                spellCheck="false"
                placeholder="Enter your email address"
                autoComplete="email"
                aria-label="Email address for account registration"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  lineHeight: '24px',
                  width: '100%',
                  height: '48px',
                  padding: '12px 16px',
                  border: errors.email ? '1px solid #EF4444' : '1px solid #E0E0E0',
                  borderRadius: '8px',
                  backgroundColor: errors.email ? '#FEF2F2' : '#FFFFFF',
                  color: '#212121',
                  outline: 'none',
                  transition: 'all 200ms ease-out'
                }}
                onFocus={(e) => {
                  e.target.style.border = '2px solid #FF6B35';
                  e.target.style.boxShadow = '0 0 0 2px rgba(255, 107, 53, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.border = errors.email ? '1px solid #EF4444' : '1px solid #E0E0E0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              {/* Validation Icons */}
              {errors.email && (
                <div 
                  style={{ 
                    position: 'absolute', 
                    top: '50%', 
                    right: '12px', 
                    transform: 'translateY(-50%)',
                    pointerEvents: 'none'
                  }}
                >
                  <X style={{ width: '16px', height: '16px', color: '#EF4444' }} />
                </div>
              )}
            </div>
            {errors.email && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginTop: '4px',
                  animation: 'slideDown 200ms ease-out'
                }}
              >
                <AlertTriangle style={{ width: '12px', height: '12px', color: '#EF4444', marginRight: '4px' }} />
                <p style={{ 
                  fontFamily: 'Inter', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  color: '#EF4444' 
                }}>
                  {errors.email.message}
                </p>
              </div>
            )}
          </div>

          {/* Password Field - Enhanced with Requirements Checklist */}
          <div style={{ marginBottom: '24px' }}>
            <label 
              style={{ 
                fontFamily: 'Inter', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374B5C',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="Create a strong password"
                autoComplete="new-password"
                aria-label="Password with complexity requirements"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  lineHeight: '24px',
                  width: '100%',
                  height: '48px',
                  padding: '12px 48px 12px 16px', // Extra padding for toggle button
                  border: errors.password ? '1px solid #EF4444' : '1px solid #E0E0E0',
                  borderRadius: '8px',
                  backgroundColor: errors.password ? '#FEF2F2' : '#FFFFFF',
                  color: '#212121',
                  outline: 'none',
                  transition: 'all 200ms ease-out'
                }}
                onFocus={(e) => {
                  e.target.style.border = '2px solid #FF6B35';
                  e.target.style.boxShadow = '0 0 0 2px rgba(255, 107, 53, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.border = errors.password ? '1px solid #EF4444' : '1px solid #E0E0E0';
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              {/* Password Visibility Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F5F5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <EyeOff style={{ width: '16px', height: '16px', color: '#9E9E9E' }} />
                ) : (
                  <Eye style={{ width: '16px', height: '16px', color: '#9E9E9E' }} />
                )}
              </button>
            </div>

            {/* Password Strength Indicator */}
            {password && (
              <div style={{ marginTop: '8px' }}>
                {/* Progress Bar */}
                <div 
                  style={{ 
                    width: '100%', 
                    height: '4px', 
                    backgroundColor: '#EEEEEE',
                    borderRadius: '9999px',
                    marginBottom: '4px'
                  }}
                >
                  <div
                    style={{
                      width: `${passwordStrength.percentage}%`,
                      height: '100%',
                      backgroundColor: passwordStrength.colorClass,
                      borderRadius: '9999px',
                      transition: 'width 300ms ease-out'
                    }}
                  />
                </div>
                
                {/* Strength Label */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#757575' }}>
                    Password strength:
                  </span>
                  <span style={{ 
                    fontFamily: 'Inter', 
                    fontSize: '12px', 
                    fontWeight: '500',
                    color: passwordStrength.colorClass 
                  }}>
                    {passwordStrength.label}
                  </span>
                </div>

                {/* Requirements Checklist */}
                <div style={{ marginTop: '8px' }}>
                  {[
                    { key: 'length', text: 'At least 8 characters' },
                    { key: 'uppercase', text: 'At least one uppercase letter' },
                    { key: 'lowercase', text: 'At least one lowercase letter' },
                    { key: 'number', text: 'At least one number' },
                    { key: 'special', text: 'At least one special character (!@#$%^&*)' }
                  ].map((req, index) => (
                    <div 
                      key={req.key}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        marginBottom: index < 4 ? '4px' : '0'
                      }}
                    >
                      <div
                        style={{
                          width: '12px',
                          height: '12px',
                          borderRadius: '50%',
                          backgroundColor: passwordStrength.requirements[req.key] ? '#10B981' : '#FFFFFF',
                          border: passwordStrength.requirements[req.key] ? 'none' : '1.5px solid #E0E0E0',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: '8px',
                          transition: 'all 200ms ease-out'
                        }}
                      >
                        {passwordStrength.requirements[req.key] && (
                          <CheckCircle style={{ width: '8px', height: '8px', color: '#FFFFFF' }} />
                        )}
                      </div>
                      <span 
                        style={{ 
                          fontFamily: 'Inter', 
                          fontSize: '12px', 
                          color: passwordStrength.requirements[req.key] ? '#212121' : '#9E9E9E',
                          transition: 'color 200ms ease-out'
                        }}
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {errors.password && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginTop: '4px'
                }}
              >
                <AlertTriangle style={{ width: '12px', height: '12px', color: '#EF4444', marginRight: '4px' }} />
                <p style={{ 
                  fontFamily: 'Inter', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  color: '#EF4444' 
                }}>
                  {errors.password.message}
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password Field */}
          <div style={{ marginBottom: '24px' }}>
            <label 
              style={{ 
                fontFamily: 'Inter', 
                fontSize: '14px', 
                fontWeight: '500',
                color: '#374B5C',
                display: 'block',
                marginBottom: '8px'
              }}
            >
              Confirm Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                {...register('confirmPassword')}
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm your password"
                autoComplete="new-password"
                aria-label="Confirm password by typing it again"
                style={{
                  fontFamily: 'Inter',
                  fontSize: '16px',
                  lineHeight: '24px',
                  width: '100%',
                  height: '48px',
                  padding: '12px 48px 12px 16px',
                  border: errors.confirmPassword ? '1px solid #EF4444' : 
                         (confirmPassword && password && confirmPassword === password ? '1px solid #10B981' : '1px solid #E0E0E0'),
                  borderRadius: '8px',
                  backgroundColor: errors.confirmPassword ? '#FEF2F2' : '#FFFFFF',
                  color: '#212121',
                  outline: 'none',
                  transition: 'all 200ms ease-out'
                }}
                onFocus={(e) => {
                  e.target.style.border = '2px solid #FF6B35';
                  e.target.style.boxShadow = '0 0 0 2px rgba(255, 107, 53, 0.2)';
                }}
                onBlur={(e) => {
                  e.target.style.border = errors.confirmPassword ? '1px solid #EF4444' : 
                                         (confirmPassword && password && confirmPassword === password ? '1px solid #10B981' : '1px solid #E0E0E0');
                  e.target.style.boxShadow = 'none';
                }}
              />
              
              {/* Password Visibility Toggle */}
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  right: '12px',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '4px'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#F5F5F5'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                {showConfirmPassword ? (
                  <EyeOff style={{ width: '16px', height: '16px', color: '#9E9E9E' }} />
                ) : (
                  <Eye style={{ width: '16px', height: '16px', color: '#9E9E9E' }} />
                )}
              </button>
            </div>

            {/* Real-time password matching feedback */}
            {confirmPassword && password && (
              <div style={{ marginTop: '4px' }}>
                {confirmPassword === password ? (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CheckCircle style={{ width: '12px', height: '12px', color: '#10B981', marginRight: '4px' }} />
                    <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#10B981' }}>
                      Passwords match
                    </span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <X style={{ width: '12px', height: '12px', color: '#EF4444', marginRight: '4px' }} />
                    <span style={{ fontFamily: 'Inter', fontSize: '12px', color: '#EF4444' }}>
                      Passwords do not match
                    </span>
                  </div>
                )}
              </div>
            )}

            {errors.confirmPassword && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginTop: '4px'
                }}
              >
                <AlertTriangle style={{ width: '12px', height: '12px', color: '#EF4444', marginRight: '4px' }} />
                <p style={{ 
                  fontFamily: 'Inter', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  color: '#EF4444' 
                }}>
                  {errors.confirmPassword.message}
                </p>
              </div>
            )}
          </div>

          {/* Terms Agreement */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                {...register('agreeToTerms')}
                type="checkbox"
                style={{
                  width: '16px',
                  height: '16px',
                  accentColor: '#FF6B35',
                  marginRight: '8px'
                }}
              />
              <label style={{ fontFamily: 'Inter', fontSize: '14px', color: '#374B5C' }}>
                I agree to the{' '}
                <a 
                  href="/terms" 
                  target="_blank" 
                  rel="noopener"
                  style={{ color: '#FF6B35', fontWeight: '500', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Terms of Service
                </a>{' '}
                and{' '}
                <a 
                  href="/privacy" 
                  target="_blank" 
                  rel="noopener"
                  style={{ color: '#FF6B35', fontWeight: '500', textDecoration: 'none' }}
                  onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                  onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
                >
                  Privacy Policy
                </a>
              </label>
            </div>
            {errors.agreeToTerms && (
              <div 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  marginTop: '4px'
                }}
              >
                <AlertTriangle style={{ width: '12px', height: '12px', color: '#EF4444', marginRight: '4px' }} />
                <p style={{ 
                  fontFamily: 'Inter', 
                  fontSize: '12px', 
                  fontWeight: '500',
                  color: '#EF4444' 
                }}>
                  {errors.agreeToTerms.message}
                </p>
              </div>
            )}
          </div>

          {/* Submit Button - Pixel Perfect */}
          <button
            type="submit"
            disabled={loading || isSubmitting}
            style={{
              width: '100%',
              height: '48px',
              background: loading || isSubmitting 
                ? '#E55A2E' 
                : 'linear-gradient(135deg, #FF6B35 0%, #E55A2E 100%)',
              border: 'none',
              borderRadius: '8px',
              color: '#FFFFFF',
              fontFamily: 'Inter',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading || isSubmitting ? 'not-allowed' : 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
              transition: 'all 150ms ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '24px'
            }}
            onMouseEnter={(e) => {
              if (!loading && !isSubmitting) {
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)';
                e.target.style.background = 'linear-gradient(135deg, #E55A2E 0%, #CC4F27 100%)';
              }
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0px)';
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)';
              e.target.style.background = loading || isSubmitting 
                ? '#E55A2E' 
                : 'linear-gradient(135deg, #FF6B35 0%, #E55A2E 100%)';
            }}
            onFocus={(e) => {
              e.target.style.outline = 'none';
              e.target.style.boxShadow = '0 0 0 2px #FF6B35, 0 0 0 4px rgba(255, 107, 53, 0.5)';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)';
            }}
          >
            {loading || isSubmitting ? (
              <>
                <div 
                  style={{
                    width: '20px',
                    height: '20px',
                    border: '2px solid #FFFFFF',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite',
                    marginRight: '8px'
                  }}
                />
                Creating Account...
              </>
            ) : (
              'Create Account'
            )}
          </button>

          {/* Sign In Link */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontFamily: 'Inter', fontSize: '14px', color: '#757575' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={onSwitchToLogin}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FF6B35',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textDecoration: 'none'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Sign in here
              </button>
            </p>
          </div>
        </form>
      </div>

      {/* Add CSS animations */}
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            height: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            height: auto;
            transform: translateY(0);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }
        
        .animate-slide-down {
          animation: slideDown 200ms ease-out;
        }
        
        .animate-shake {
          animation: shake 300ms ease-in-out;
        }
        
        /* Responsive adjustments */
        @media (max-width: 320px) {
          input {
            font-size: 16px !important; /* Prevent iOS zoom */
          }
        }
        
        @media (min-width: 768px) {
          /* Tablet adjustments */
        }
        
        @media (min-width: 1024px) {
          /* Desktop hover states already implemented */
        }
      `}</style>
    </div>
  );
};

export default PixelPerfectRegisterForm;