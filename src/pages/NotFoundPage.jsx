import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-lg text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="text-8xl font-bold text-emerald-600 mb-4">404</div>
          <div className="text-6xl mb-6">🐕</div>
        </div>

        {/* Error Message */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Oops! This page went for a walk
        </h1>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist. It might have been moved, 
          deleted, or you entered the wrong URL.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </Link>
          
          <Link
            to="/search"
            className="inline-flex items-center justify-center gap-2 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            <Search className="w-5 h-5" />
            Search Suppliers
          </Link>
        </div>

        {/* Go Back Button */}
        <div className="mt-6">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back to previous page
          </button>
        </div>

        {/* Help Section */}
        <div className="mt-12 p-6 bg-white rounded-lg border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-3">Need Help?</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <p>
              If you think this is an error, please{' '}
              <a href="/contact" className="text-emerald-600 hover:text-emerald-500 underline">
                contact our support team
              </a>
              .
            </p>
            <p>
              You can also try searching for what you need using our{' '}
              <Link to="/search" className="text-emerald-600 hover:text-emerald-500 underline">
                supplier search
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;