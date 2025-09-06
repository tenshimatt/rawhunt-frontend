import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin } from 'lucide-react';

const SearchPageSimple = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Simple search handler without complex API calls
  const handleSearch = () => {
    console.log('Search triggered:', { searchQuery, location });
    setLoading(true);
    
    // Simulate API call with fake data
    setTimeout(() => {
      setSuppliers([
        {
          id: '1',
          name: 'Premium Raw Foods Co.',
          location_address: '123 Main St, Los Angeles, CA',
          category: 'Raw Dog Food',
          rating_average: 4.8,
          distance: '2.3'
        },
        {
          id: '2', 
          name: 'Natural Pet Nutrition',
          location_address: '456 Oak Ave, Los Angeles, CA',
          category: 'Organic Pet Food',
          rating_average: 4.6,
          distance: '5.1'
        }
      ]);
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Search Section */}
      <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Premium Raw Dog Food Near You
            </h1>
            <p className="text-xl text-emerald-100">
              Discover trusted suppliers, earn reward points, and give your dog the nutrition they deserve
            </p>
          </div>

          {/* Simplified Search Form */}
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-2">
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200">
                  <Search className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Search for suppliers, brands, or products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 outline-none text-gray-900"
                  />
                </div>
                <div className="flex items-center px-4 py-3 md:w-64">
                  <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                  <input
                    type="text"
                    placeholder="Location or ZIP"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 outline-none text-gray-900"
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-medium transition-colors"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="flex justify-center gap-8 mt-12">
            <div className="text-center">
              <div className="text-3xl font-bold">5,000+</div>
              <div className="text-emerald-100">Verified Suppliers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">50,000+</div>
              <div className="text-emerald-100">Happy Dogs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">4.9/5</div>
              <div className="text-emerald-100">Average Rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Searching...' : `${suppliers.length} Suppliers Found`}
          </h2>
          <p className="text-gray-600">
            {searchQuery || location 
              ? `Results for "${searchQuery || location}"`
              : 'Premium raw dog food suppliers'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Simple Results List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {loading ? (
            <div className="flex justify-center items-center h-64 col-span-full">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
            </div>
          ) : suppliers.length > 0 ? (
            suppliers.map((supplier) => (
              <div key={supplier.id} 
                   className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-200 hover:border-emerald-300">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">
                      {supplier.name}
                    </h3>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{supplier.location_address}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-500">
                      <span>{supplier.distance} miles</span>
                      <span>•</span>
                      <span>{supplier.category}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4">
                    <span className="text-lg">⭐</span>
                    <span className="font-medium text-lg text-gray-900">{supplier.rating_average}</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Link 
                    to={`/supplier/${supplier.id}`}
                    className="flex-1 py-2 px-4 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-all duration-300 text-center"
                  >
                    View Details
                  </Link>
                  <button 
                    onClick={() => window.open(`https://maps.google.com/?q=${supplier.location_address}`, '_blank')}
                    className="flex-1 py-2 px-4 rounded text-sm font-medium transition-all duration-300 border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                  >
                    Get Directions
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 col-span-full">
              <p className="text-gray-500">No suppliers found. Try searching for something!</p>
              <button 
                onClick={handleSearch}
                className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Load Sample Data
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Simple Call to Action */}
      <div className="bg-gradient-to-r from-amber-400 to-yellow-500 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white">
            <h3 className="text-3xl font-bold mb-4">Join PAWS Rewards</h3>
            <p className="text-xl mb-6">Earn points on every purchase and unlock exclusive discounts</p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/auth/register"
                className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-colors"
              >
                Start Earning PAWS
              </Link>
              <Link
                to="/auth/login"
                className="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 rounded-lg font-bold transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPageSimple;