import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter, Navigation, X } from 'lucide-react';
import { useSuppliers } from '../../hooks/useSuppliers';
import { SUPPLIER_CATEGORIES, SORT_OPTIONS, SORT_DISPLAY } from '../../utils/constants';

const SupplierSearch = ({ onResults, initialQuery = '', initialLocation = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState(SORT_OPTIONS.RECOMMENDED);
  const [showFilters, setShowFilters] = useState(false);
  const [isUsingLocation, setIsUsingLocation] = useState(false);

  const {
    suppliers,
    loading,
    error,
    searchSuppliers,
    useCurrentLocation,
    clearError,
    pagination,
  } = useSuppliers();

  // Pass results to parent component
  useEffect(() => {
    onResults?.({
      suppliers,
      loading,
      error,
      pagination,
    });
  }, [suppliers, loading, error, pagination, onResults]);

  const handleSearch = async (params = {}) => {
    clearError();
    
    const searchParams = {
      query: searchQuery.trim() || undefined,
      location: location.trim() || undefined,
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      sort: sortBy,
      ...params,
    };

    await searchSuppliers(searchParams);
  };

  const handleUseCurrentLocation = async () => {
    setIsUsingLocation(true);
    try {
      await useCurrentLocation();
      setLocation('Current Location');
    } catch (error) {
      console.error('Failed to get current location:', error);
    } finally {
      setIsUsingLocation(false);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setSelectedCategory(categoryId);
    handleSearch({ category: categoryId === 'all' ? undefined : categoryId });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    handleSearch({ sort: newSortBy });
  };

  const clearLocation = () => {
    setLocation('');
    handleSearch({ location: undefined });
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
              {/* Search Input */}
              <div className="flex-1 flex items-center px-4 py-3 border-r border-gray-200">
                <Search className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Search for suppliers, brands, or products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                />
              </div>

              {/* Location Input */}
              <div className="flex items-center px-4 py-3 md:w-64">
                <MapPin className="w-5 h-5 text-gray-400 mr-3" />
                <input
                  type="text"
                  placeholder="Location or ZIP"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 outline-none text-gray-900 placeholder-gray-500"
                />
                {location && (
                  <button
                    onClick={clearLocation}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Use Current Location Button */}
              <button
                onClick={handleUseCurrentLocation}
                disabled={isUsingLocation}
                className="hidden md:flex items-center gap-2 px-4 py-3 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors disabled:opacity-50"
                title="Use current location"
              >
                {isUsingLocation ? (
                  <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
              </button>

              {/* Search Button */}
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Searching...
                  </div>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>

          {/* Mobile Current Location Button */}
          <div className="md:hidden mt-4 flex justify-center">
            <button
              onClick={handleUseCurrentLocation}
              disabled={isUsingLocation}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors disabled:opacity-50"
            >
              {isUsingLocation ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Navigation className="w-4 h-4" />
              )}
              Use Current Location
            </button>
          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {SUPPLIER_CATEGORIES.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryChange(category.id)}
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

          {/* Sort and Filter Bar */}
          <div className="flex items-center justify-between mt-6 bg-white/10 backdrop-blur rounded-lg p-4">
            <div className="flex items-center gap-4">
              <label className="text-emerald-100 text-sm">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-white/50 focus:border-white/50"
              >
                {Object.entries(SORT_DISPLAY).map(([value, label]) => (
                  <option key={value} value={value} className="text-gray-900">
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-white transition-colors"
            >
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 bg-white/10 backdrop-blur rounded-lg p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Distance Filter */}
                <div>
                  <h4 className="font-medium text-emerald-100 mb-3">Distance</h4>
                  <select className="w-full bg-white/20 border border-white/30 rounded-lg px-3 py-2 text-white text-sm">
                    <option className="text-gray-900">Within 5 miles</option>
                    <option className="text-gray-900">Within 10 miles</option>
                    <option className="text-gray-900">Within 25 miles</option>
                    <option className="text-gray-900">Within 50 miles</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h4 className="font-medium text-emerald-100 mb-3">Price Range</h4>
                  <div className="space-y-2">
                    {['$ Budget-friendly', '$$ Mid-range', '$$$ Premium', '$$$$ Luxury'].map((price) => (
                      <label key={price} className="flex items-center text-emerald-100 text-sm">
                        <input type="checkbox" className="mr-2 rounded" />
                        {price}
                      </label>
                    ))}
                  </div>
                </div>

                {/* Services Filter */}
                <div>
                  <h4 className="font-medium text-emerald-100 mb-3">Services</h4>
                  <div className="space-y-2">
                    {['Home Delivery', 'Subscription Plans', 'Nutritional Consultation', 'Custom Meal Plans'].map((service) => (
                      <label key={service} className="flex items-center text-emerald-100 text-sm">
                        <input type="checkbox" className="mr-2 rounded" />
                        {service}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button className="px-4 py-2 text-emerald-100 hover:text-white transition-colors">
                  Clear Filters
                </button>
                <button className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg text-white font-medium transition-colors">
                  Apply Filters
                </button>
              </div>
            </div>
          )}
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

export default SupplierSearch;