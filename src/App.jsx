import React, { useState, useEffect } from 'react';
import { Search, MapPin, Star, Filter, Phone, Clock, ChevronRight, DollarSign, Truck, Shield, Award } from 'lucide-react';
import { suppliersAPI, authAPI, apiUtils } from './services/api';
import ProductionMap from './components/ProductionMap';

// PAWS Token Display Component
const PAWSBalance = ({ balance = 1250 }) => {
  return (
    <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 rounded-lg border border-amber-200">
      <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
        <span className="text-xs">🐾</span>
      </div>
      <div>
        <div className="text-xs text-amber-600">PAWS Balance</div>
        <div className="font-bold text-amber-900">{balance.toLocaleString()}</div>
      </div>
    </div>
  );
};

// Navigation Bar
const Navigation = ({ onShowLogin, onShowRegister, user, pawsBalance }) => {

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Rawgle</h1>
                <p className="text-xs text-gray-500">Raw Feeding Community. For the love of our Pets!</p>
              </div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <PAWSBalance balance={pawsBalance} />
            <button className="text-gray-600 hover:text-gray-900 p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </button>
            {user ? (
              <div className="flex items-center gap-3">
                <img 
                  className="w-8 h-8 rounded-full bg-emerald-100" 
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || user.email || 'User')}&background=10b981&color=fff&size=32`} 
                  alt={user.name || 'User'} 
                />
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            ) : (
              <div className="flex gap-2">
                <button 
                  onClick={onShowLogin}
                  className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={onShowRegister}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  Register
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

// Login Form Component
const LoginForm = ({ onClose, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await authAPI.login({ email, password });

      if (response.data) {
        onSuccess({ 
          user: response.data.user || response.data, 
          token: response.data.token 
        });
        onClose();
      } else {
        setError('Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Sign In to Rawgle</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Register Form Component
const RegisterForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Transform data to match API expectations
      const registrationData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.name.split(' ')[0] || '',
        lastName: formData.name.split(' ').slice(1).join(' ') || '',
        phoneNumber: formData.phone
      };

      const response = await authAPI.register(registrationData);

      if (response.data) {
        onSuccess({ 
          user: response.data.user || response.data, 
          token: response.data.token 
        });
        onClose();
      } else {
        setError('Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-6">Join Rawgle</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="register-name" className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              id="register-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              id="register-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="register-phone" className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              id="register-phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              id="register-password"
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

  return (
    <div className="bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Premium Raw Dog Food Near You
          </h1>
          <p className="text-xl text-emerald-100">
            Discover trusted suppliers, earn PAWS rewards, and give your dog the nutrition they deserve
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

// Enhanced Supplier Card Component with Rawgle Production Theme
const SupplierCard = ({ supplier }) => {
  const earnRate = Math.round(supplier.avgPrice * 0.1 || 5); // 10% PAWS back
  const distance = supplier.distance || '2.3';

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-yellow-600 hover:-translate-y-1">
      {/* Header with supplier image placeholder and badges */}
      <div className="relative">
        <div className="w-full h-40 bg-gradient-to-br from-yellow-50 to-orange-50 flex items-center justify-center border-b border-gray-100"
             style={{ backgroundColor: '#E8DCC6' }}>
          <span className="text-5xl">🏪</span>
        </div>
        
        {/* Verification Badge */}
        {supplier.is_verified && (
          <div className="absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-semibold text-white"
               style={{ backgroundColor: '#D4A574' }}>
            ✓ Verified
          </div>
        )}
        
        {/* Delivery Badge */}
        {(supplier.delivery_available || supplier.price_range === 'medium') && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-full text-xs font-medium text-gray-700 shadow-sm">
            <Truck className="w-3 h-3 inline mr-1" />
            Delivery
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Supplier Name and Basic Info */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-900 mb-1" style={{ color: '#2C1810' }}>
            {supplier.name}
          </h3>
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-1">
            <span>📍</span>
            <span>{supplier.location_address || 'Address not available'}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span>{distance} miles away</span>
            <span>•</span>
            <span>{supplier.category}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <span>⭐</span>
          <span className="font-semibold text-gray-900">{supplier.rating_average}</span>
          <span className="text-sm text-gray-500">({supplier.rating_count || 0} reviews)</span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {supplier.description || 'Premium raw dog food supplier committed to quality nutrition for your pets.'}
        </p>

        {/* Specialties and Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="px-2 py-1 text-xs rounded-full text-white font-medium"
                style={{ backgroundColor: '#D4A574' }}>
            {supplier.category}
          </span>
          {supplier.is_verified && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">
              Certified
            </span>
          )}
          {supplier.organic && (
            <span className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">
              Organic
            </span>
          )}
          {supplier.local_sourced && (
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">
              Local Sourced
            </span>
          )}
        </div>

        {/* Contact Information */}
        <div className="space-y-2 mb-4 text-sm">
          {supplier.contact_phone && (
            <div className="flex items-center gap-2 text-gray-600">
              <span>📞</span>
              <a href={`tel:${supplier.contact_phone}`} 
                 className="hover:text-yellow-600 transition-colors"
                 style={{ color: '#8B6914' }}>
                {supplier.contact_phone}
              </a>
            </div>
          )}
          {supplier.website_url && (
            <div className="flex items-center gap-2 text-gray-600">
              <span>🌐</span>
              <a href={supplier.website_url} 
                 target="_blank" 
                 rel="noopener noreferrer"
                 className="hover:text-yellow-600 transition-colors truncate"
                 style={{ color: '#8B6914' }}>
                Visit Website
              </a>
            </div>
          )}
          {supplier.email && (
            <div className="flex items-center gap-2 text-gray-600">
              <span>✉️</span>
              <a href={`mailto:${supplier.email}`}
                 className="hover:text-yellow-600 transition-colors"
                 style={{ color: '#8B6914' }}>
                Contact Email
              </a>
            </div>
          )}
        </div>

        {/* PAWS Rewards Section */}
        <div className="rounded-lg p-3 mb-4 border"
             style={{ backgroundColor: '#E8DCC6', borderColor: '#D4A574' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-base">🐾</span>
              <span className="font-medium text-sm" style={{ color: '#2C1810' }}>
                Earn {earnRate} PAWS per order
              </span>
            </div>
            <span className="text-xs font-medium" style={{ color: '#8B6914' }}>
              {supplier.price_range || 'medium'} price
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button 
            onClick={() => alert(`${supplier.name}\n\n📍 ${supplier.location_address}\n📞 ${supplier.contact_phone || 'N/A'}\n🌐 ${supplier.website_url || 'N/A'}\n⭐ Rating: ${supplier.rating_average}/5\n📝 ${supplier.description}`)}
            className="flex-1 py-2 px-3 rounded-lg text-white font-medium text-sm transition-all duration-300 hover:shadow-md"
            style={{ backgroundColor: '#D4A574' }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#B8956A'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#D4A574'}
          >
            View Details
          </button>
          <button 
            onClick={() => window.open(`https://maps.google.com/?q=${supplier.location_address}`, '_blank')}
            className="flex-1 py-2 px-3 rounded-lg font-medium text-sm transition-all duration-300 border hover:shadow-md"
            style={{ 
              borderColor: '#D4A574', 
              color: '#8B6914',
              backgroundColor: 'white'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#E8DCC6';
              e.target.style.color = '#2C1810';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'white';
              e.target.style.color = '#8B6914';
            }}
          >
            Get Route
          </button>
        </div>

        {/* Additional Info Row */}
        <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
          <span>ID: {supplier.id}</span>
          {supplier.hours && (
            <span>🕒 Open until {supplier.hours}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// Main App Component
const RawgleApp = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({});
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize user from localStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('rawgle_user');
    const savedToken = localStorage.getItem('rawgle_token');
    
    if (savedUser && savedToken) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (err) {
        console.error('Error parsing saved user:', err);
        localStorage.removeItem('rawgle_user');
        localStorage.removeItem('rawgle_token');
      }
    }
  }, []);

  // Load initial suppliers from API
  useEffect(() => {
    loadSuppliers();
  }, []);

  const loadSuppliers = async (params = {}) => {
    setLoading(true);
    setError('');
    
    try {
      const searchParams = {
        search: params.query || params.search || '',
        location: params.location || '',
        latitude: params.latitude || '40.7128',
        longitude: params.longitude || '-74.0060',
        radius: params.radius || '10',
        ...(params.category && params.category !== 'all' && { category: params.category })
      };

      const response = await suppliersAPI.search(searchParams);

      if (response.success && response.data && response.data.suppliers) {
        setSuppliers(response.data.suppliers);
      } else {
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
    setSearchParams(params);
    loadSuppliers(params);
  };

  const handleLoginSuccess = ({ user: userData, token }) => {
    setUser(userData);
    localStorage.setItem('rawgle_user', JSON.stringify(userData));
    localStorage.setItem('rawgle_token', token);
    setShowLogin(false);
    setSuccessMessage(`Welcome back, ${userData.name}!`);
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  const handleRegisterSuccess = ({ user: userData, token }) => {
    setUser(userData);
    localStorage.setItem('rawgle_user', JSON.stringify(userData));
    localStorage.setItem('rawgle_token', token);
    setShowRegister(false);
    setSuccessMessage(`Registration successful! Welcome to Rawgle, ${userData.name}! You've received ${userData.pawsBalance} PAWS as a welcome bonus.`);
    setTimeout(() => setSuccessMessage(''), 8000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation 
        onShowLogin={() => setShowLogin(true)}
        onShowRegister={() => setShowRegister(true)}
        user={user}
        pawsBalance={user?.pawsBalance || 1250}
      />
      <HeroSearch onSearch={handleSearch} />
      
      {/* Success Message */}
      {successMessage && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded-lg mb-4">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center mr-3">
                <span className="text-white text-sm">✓</span>
              </div>
              {successMessage}
            </div>
          </div>
        </div>
      )}
      
      {/* Results Section with Map */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {loading ? 'Loading...' : `${suppliers.length} Suppliers Found`}
          </h2>
          <p className="text-gray-600">Premium raw dog food suppliers in your area</p>
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
                // Update search with user location
                loadSuppliers({
                  latitude: location.latitude,
                  longitude: location.longitude,
                  radius: '10'
                });
              }}
              onSupplierClick={(supplierId) => {
                const supplier = suppliers.find(s => s.id === supplierId);
                if (supplier) {
                  alert(`${supplier.name}\n\n📍 ${supplier.location_address}\n📞 ${supplier.contact_phone || 'N/A'}\n🌐 ${supplier.website_url || 'N/A'}\n⭐ Rating: ${supplier.rating_average}/5`);
                }
              }}
            />
          </div>

          {/* Suppliers List Column - Compact Theme Cards */}
          <div className="space-y-3" style={{ height: '600px', overflowY: 'auto' }}>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2" style={{ borderColor: '#D4A574' }}></div>
              </div>
            ) : suppliers.length > 0 ? (
              suppliers.map((supplier) => (
                <div key={supplier.id} 
                     className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3 border border-gray-200 hover:border-yellow-600">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="text-base font-semibold mb-1" style={{ color: '#2C1810' }}>
                        {supplier.name}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
                        <span>📍</span>
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
                  
                  {/* Contact & Tags Row */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex gap-3">
                      {supplier.contact_phone && (
                        <a href={`tel:${supplier.contact_phone}`} 
                           className="text-xs" 
                           style={{ color: '#8B6914' }}>
                          📞
                        </a>
                      )}
                      {supplier.website_url && (
                        <a href={supplier.website_url} 
                           target="_blank" 
                           rel="noopener noreferrer"
                           className="text-xs" 
                           style={{ color: '#8B6914' }}>
                          🌐
                        </a>
                      )}
                    </div>
                    <div className="flex gap-1">
                      {supplier.is_verified && (
                        <span className="px-2 py-0.5 text-xs rounded-full text-white font-medium"
                              style={{ backgroundColor: '#D4A574' }}>
                          ✓
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => alert(`${supplier.name}\n\n📍 ${supplier.location_address}\n📞 ${supplier.contact_phone || 'N/A'}\n🌐 ${supplier.website_url || 'N/A'}\n⭐ Rating: ${supplier.rating_average}/5`)}
                      className="flex-1 py-1.5 px-2 rounded text-white text-xs font-medium transition-all duration-300"
                      style={{ backgroundColor: '#D4A574' }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#B8956A'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#D4A574'}
                    >
                      Details
                    </button>
                    <button 
                      onClick={() => window.open(`https://maps.google.com/?q=${supplier.location_address}`, '_blank')}
                      className="flex-1 py-1.5 px-2 rounded text-xs font-medium transition-all duration-300 border"
                      style={{ 
                        borderColor: '#D4A574', 
                        color: '#8B6914',
                        backgroundColor: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#E8DCC6';
                        e.target.style.color = '#2C1810';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.color = '#8B6914';
                      }}
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

      {/* PAWS Rewards Banner */}
      {!user && (
        <div className="bg-gradient-to-r from-amber-400 to-yellow-500 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center text-white">
              <h3 className="text-3xl font-bold mb-4">Join PAWS Rewards</h3>
              <p className="text-xl mb-6">Earn points on every purchase and unlock exclusive discounts</p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => setShowRegister(true)}
                  className="bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-bold transition-colors"
                >
                  Start Earning PAWS
                </button>
                <button 
                  onClick={() => setShowLogin(true)}
                  className="border-2 border-white text-white hover:bg-white hover:text-amber-600 px-8 py-3 rounded-lg font-bold transition-colors"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <LoginForm 
          onClose={() => setShowLogin(false)}
          onSuccess={handleLoginSuccess}
        />
      )}

      {/* Register Modal */}
      {showRegister && (
        <RegisterForm 
          onClose={() => setShowRegister(false)}
          onSuccess={handleRegisterSuccess}
        />
      )}
    </div>
  );
};

export default RawgleApp;