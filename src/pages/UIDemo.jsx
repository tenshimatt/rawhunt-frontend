import React, { useState } from 'react';
import PixelPerfectRegisterForm from '../components/auth/PixelPerfectRegisterForm';
import PetProfileWizard from '../components/pet/PetProfileWizard';

const UIDemo = () => {
  const [currentDemo, setCurrentDemo] = useState('register');
  const [showWizard, setShowWizard] = useState(false);

  const handleRegistrationSuccess = () => {
    console.log('Registration successful!');
    setCurrentDemo('wizard');
    setShowWizard(true);
  };

  const handleSwitchToLogin = () => {
    console.log('Switch to login requested');
  };

  const handleWizardComplete = (petData) => {
    console.log('Pet profile completed:', petData);
    alert('Pet profile completed successfully!');
    setShowWizard(false);
    setCurrentDemo('register');
  };

  const handleWizardCancel = () => {
    setShowWizard(false);
    setCurrentDemo('register');
  };

  if (showWizard) {
    return (
      <PetProfileWizard
        onComplete={handleWizardComplete}
        onCancel={handleWizardCancel}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="font-poppins font-bold text-3xl text-[#212121] mb-4">
            Raw Pet Food Platform - UI Components Demo
          </h1>
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentDemo('register')}
              className={`px-4 py-2 rounded-lg font-inter font-medium transition-colors ${
                currentDemo === 'register'
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Registration Form
            </button>
            <button
              onClick={() => {
                setCurrentDemo('wizard');
                setShowWizard(true);
              }}
              className={`px-4 py-2 rounded-lg font-inter font-medium transition-colors ${
                currentDemo === 'wizard'
                  ? 'bg-[#FF6B35] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Pet Profile Wizard
            </button>
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="max-w-4xl mx-auto px-4">
        {currentDemo === 'register' && (
          <div>
            <div className="mb-8 p-6 bg-white rounded-lg shadow-sm">
              <h2 className="font-poppins font-semibold text-xl text-[#212121] mb-4">
                Pixel-Perfect Registration Form
              </h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-inter font-medium text-lg text-[#212121] mb-3">Features:</h3>
                  <ul className="space-y-2 text-sm text-[#757575]">
                    <li>• Raw orange color scheme (#FF6B35) as specified</li>
                    <li>• Enhanced password strength indicator with requirements checklist</li>
                    <li>• Real-time validation with visual feedback</li>
                    <li>• Inter/Poppins typography as specified</li>
                    <li>• Pixel-perfect spacing and dimensions</li>
                    <li>• Smooth animations and micro-interactions</li>
                    <li>• Fully responsive design</li>
                    <li>• Accessibility compliant (WCAG AA)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-inter font-medium text-lg text-[#212121] mb-3">Design System:</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-[#FF6B35] rounded-full"></div>
                      <span className="text-xs text-[#757575]">Raw Orange</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-[#212121] rounded-full"></div>
                      <span className="text-xs text-[#757575]">Charcoal</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-[#757575] rounded-full"></div>
                      <span className="text-xs text-[#757575]">Gray 600</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 bg-[#10B981] rounded-full"></div>
                      <span className="text-xs text-[#757575]">Success</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <PixelPerfectRegisterForm
              onSuccess={handleRegistrationSuccess}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UIDemo;