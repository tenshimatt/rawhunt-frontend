import React from 'react';
import { Outlet, Link } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rawgle</h1>
                <p className="text-xs text-gray-500">Raw Feeding Community</p>
              </div>
            </Link>

            {/* Back to App */}
            <Link 
              to="/"
              className="text-emerald-600 hover:text-emerald-500 font-medium text-sm transition-colors"
            >
              Back to Search
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2025 Rawgle. All rights reserved.</p>
            <div className="flex justify-center gap-6 mt-2">
              <a href="/terms" className="hover:text-emerald-600 transition-colors">Terms</a>
              <a href="/privacy" className="hover:text-emerald-600 transition-colors">Privacy</a>
              <a href="/support" className="hover:text-emerald-600 transition-colors">Support</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;