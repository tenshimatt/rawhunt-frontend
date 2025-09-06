import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter } from 'lucide-react';
import { suppliersAPI, apiUtils } from '../services/api';
import ProductionMap from '../components/ProductionMap';
import { useAuth } from '../contexts/AuthContext';

// Hero Search Section
const HeroSearch = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Categories', icon: '🍖' },
    { id: 'beef', name: 'Raw Beef', icon: '🥩' },
    { id: 'chicken', name: 'Raw Chicken', icon: '🍗' },
    { id: 'fish', name: 'Raw Fish', icon: '🐟' },
    { id: 'freeze-dried', name: 'Freeze-Dried', icon: '❄️' },
    { id: 'organic', name: 'Organic', icon: '🌿' },
    { id: 'supplements', name: 'Supplements', icon: '💊' },
  ];

  const handleSearch = () => {
    onSearch({ query: searchQuery, location, category: selectedCategory });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
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

        {/* Search Form */}
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

          {/* Quick Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full border transition-all ${
                  selectedCategory === category.id
                    ? 'bg-white text-emerald-700 border-white'
                    : 'border-white/30 text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </button>
            ))}
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
  );
};

const SearchPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [error, setError] = useState('');
  const [initialLoad, setInitialLoad] = useState(true);

  // Load initial suppliers on component mount
  useEffect(() => {
    if (initialLoad) {
      loadSuppliers();
    }
  }, []);

  const isLocationQuery = (query) => {
    if (!query) return false;
    
    const locationPatterns = [
      /^[a-zA-Z\s]+,\s*[A-Z]{2}$/i,
      /^\d{5}(-\d{4})?$/,
      /^(new york|los angeles|chicago|houston|philadelphia|phoenix|san antonio|san diego|dallas|san jose|austin|jacksonville|fort worth|columbus|charlotte|san francisco|indianapolis|seattle|denver|washington|boston|el paso|detroit|nashville|memphis|portland|oklahoma city|las vegas|louisville|baltimore|milwaukee|albuquerque|tucson|fresno|sacramento|mesa|kansas city|atlanta|long beach|colorado springs|raleigh|miami|virginia beach|omaha|minneapolis|tulsa|cleveland|wichita|arlington)$/i,
    ];
    
    return locationPatterns.some(pattern => pattern.test(query.trim()));
  };

  const loadSuppliers = async (params = {}) => {
    console.log('loadSuppliers called with:', params);
    setLoading(true);
    setError('');
    
    try {
      let searchParams = {};
      
      if (params.query || params.search || params.location || (params.latitude && params.longitude)) {
        const query = params.query || params.search || '';
        
        if (params.location || isLocationQuery(query)) {
          searchParams = {
            search: '',
            location: params.location || query,
            radius: params.radius || '50',
            ...(params.category && params.category !== 'all' && { category: params.category })
          };
        } else {
          searchParams = {
            search: query,
            location: params.location || '',
            ...(params.latitude && params.longitude && {
              latitude: params.latitude,
              longitude: params.longitude
            }),
            radius: params.radius || '25',
            ...(params.category && params.category !== 'all' && { category: params.category })
          };
        }
      } else {
        searchParams = {
          search: '',
          radius: '20'
        };
      }
      
      console.log('API call with searchParams:', searchParams);
      const response = await suppliersAPI.search(searchParams);
      console.log('API response received:', response);

      if (response.success && response.data && response.data.suppliers) {
        console.log('Setting suppliers:', response.data.suppliers.length, 'suppliers found');
        setSuppliers(response.data.suppliers);
        setSearchParams(params);
      } else {
        console.log('Failed response:', response);
        setError('Failed to load suppliers');
      }
    } catch (err) {
      console.error('Error loading suppliers:', err);
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params) => {
    console.log('Search triggered with params:', params);
    setSearchParams(params);
    setInitialLoad(false);
    loadSuppliers(params);
  };

  const handleViewSupplierDetails = (supplier) => {
    // This will be handled by the router
    console.log('View supplier details:', supplier.id);
  };

  return (
    <div>
      <HeroSearch onSearch={handleSearch} />
      
      {/* Results Section with Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Loading...' : `${suppliers.length} Suppliers Found`}
          </h2>
          <p className="text-gray-600">
            {searchParams.query || searchParams.search || searchParams.location 
              ? `Results for "${searchParams.query || searchParams.search || searchParams.location}"`
              : 'Premium raw dog food suppliers near your location'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Map and Results Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Map Column */}
          <div className="bg-white rounded-lg" style={{ height: '600px' }}>
            <ProductionMap 
              suppliers={suppliers}
              onLocationFound={(location) => {
                loadSuppliers({
                  latitude: location.latitude,
                  longitude: location.longitude,
                  radius: '10'
                });
              }}
              onSupplierClick={(supplierId) => {
                const supplier = suppliers.find(s => s.id === supplierId);
                if (supplier) {
                  handleViewSupplierDetails(supplier);
                }
              }}
            />
          </div>

          {/* Suppliers List Column */}
          <div className="space-y-3" style={{ height: '600px', overflowY: 'auto' }}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div>
              </div>
            ) : suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <div key={supplier.id} 
                     className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 border border-gray-200 hover:border-emerald-300">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-1 text-gray-900">
                        {supplier.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <MapPin className="w-3 h-3" />
                        <span className="truncate">{supplier.location_address}</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span>{supplier.distance || '2.3'} miles</span>
                        <span>•</span>
                        <span>{supplier.category}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-2">
                      <span className="text-sm">⭐</span>
                      <span className="font-medium text-sm text-gray-900">{supplier.rating_average}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Link 
                      to={`/supplier/${supplier.id}`}
                      className="flex-1 py-1.5 px-2 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium transition-all duration-300 text-center"
                    >
                      Details
                    </Link>
                    <button 
                      onClick={() => window.open(`https://maps.google.com/?q=${supplier.location_address}`, '_blank')}
                      className="flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all duration-300 border border-emerald-600 text-emerald-600 hover:bg-emerald-50"
                    >
                      Route
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No suppliers found. Try adjusting your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* PAWS Rewards Banner - Only show if not authenticated */}
      {!isAuthenticated && (
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
      )}
    </div>
  );
};

export default SearchPage;