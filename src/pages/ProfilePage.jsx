import React from 'react';
import { User, Settings, MapPin, Phone, Mail, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const ProfilePage = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Profile Settings</h1>
        
        {/* Profile Header */}
        <div className="flex items-center gap-6 mb-8">
          <img 
            className="w-20 h-20 rounded-full bg-emerald-100" 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || user?.email || 'User')}&background=10b981&color=fff&size=80`} 
            alt={user?.name || 'User'} 
          />
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name || 'Pet Parent'}</h2>
            <p className="text-gray-600">{user?.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <Award className="w-4 h-4 text-emerald-600" />
              <span className="text-sm text-emerald-600 font-medium">Premium Member</span>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Profile Settings Coming Soon</h3>
          <p className="text-blue-700 mb-4">
            We're working hard to bring you comprehensive profile management features. 
            Soon you'll be able to update your information, manage preferences, and much more!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <User className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Personal Information</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Update name and contact details</li>
                <li>• Manage profile photo</li>
                <li>• Set dietary preferences</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Location & Preferences</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Set default search location</li>
                <li>• Manage delivery addresses</li>
                <li>• Search radius preferences</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Settings className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Account Settings</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Change password</li>
                <li>• Notification preferences</li>
                <li>• Privacy settings</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-3 mb-2">
                <Award className="w-5 h-5 text-blue-600" />
                <h4 className="font-medium text-blue-900">Pet Profiles</h4>
              </div>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Add your pets information</li>
                <li>• Dietary requirements</li>
                <li>• Health considerations</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Current Information Display */}
        <div className="mt-8 space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Current Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Email Address</h4>
              </div>
              <p className="text-gray-700">{user?.email || 'Not provided'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <User className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Full Name</h4>
              </div>
              <p className="text-gray-700">{user?.name || 'Not provided'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <Phone className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Phone Number</h4>
              </div>
              <p className="text-gray-700">{user?.phoneNumber || 'Not provided'}</p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin className="w-5 h-5 text-gray-600" />
                <h4 className="font-medium text-gray-900">Location</h4>
              </div>
              <p className="text-gray-700">{user?.location || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;