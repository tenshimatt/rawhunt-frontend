import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Star, 
  TrendingUp, 
  ShoppingCart, 
  MessageSquare, 
  Award,
  ChevronRight,
  Calendar
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { pawsAPI, suppliersAPI, reviewsAPI, apiUtils } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const [pawsBalance, setPawsBalance] = useState(0);
  const [recentSuppliers, setRecentSuppliers] = useState([]);
  const [stats, setStats] = useState({
    totalReviews: 0,
    totalOrders: 0,
    pointsEarned: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user || !apiUtils.isAuthenticated()) return;

    try {
      setLoading(true);
      
      // Load PAWS balance
      const pawsResponse = await pawsAPI.getBalance();
      if (pawsResponse.success && pawsResponse.data) {
        setPawsBalance(pawsResponse.data.balance || 0);
      }

      // Load recent suppliers (limited)
      const suppliersResponse = await suppliersAPI.search({ limit: 6 });
      if (suppliersResponse.success && suppliersResponse.data) {
        setRecentSuppliers(suppliersResponse.data.suppliers || []);
      }

      // Note: These would require additional API endpoints
      // For now, we'll use placeholder data
      setStats({
        totalReviews: 0,
        totalOrders: 0,
        pointsEarned: pawsResponse.data?.balance || 0
      });

    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Pet Parent'}! 🐾
        </h1>
        <p className="text-gray-600 mt-2">
          Here's what's happening with your raw feeding journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* PAWS Balance */}
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-6 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-600 text-sm font-medium">Reward Points</p>
              <p className="text-2xl font-bold text-amber-900">{pawsBalance.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xl">🐾</span>
            </div>
          </div>
          <Link 
            to="/paws"
            className="text-amber-600 hover:text-amber-700 text-sm font-medium mt-4 inline-flex items-center gap-1"
          >
            View Details <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Reviews */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Reviews Written</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalReviews}</p>
            </div>
            <Star className="w-12 h-12 text-emerald-600 bg-emerald-50 rounded-full p-3" />
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Share your experiences to help others
          </p>
        </div>

        {/* Activity Score */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm font-medium">Activity Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.min(100, pawsBalance / 10).toFixed(0)}
              </p>
            </div>
            <TrendingUp className="w-12 h-12 text-blue-600 bg-blue-50 rounded-full p-3" />
          </div>
          <p className="text-gray-500 text-sm mt-4">
            Keep exploring to increase your score
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          to="/search"
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-8 h-8 text-emerald-600 group-hover:text-emerald-700" />
            <div>
              <p className="font-medium text-gray-900">Find Suppliers</p>
              <p className="text-sm text-gray-500">Discover local raw food</p>
            </div>
          </div>
        </Link>

        <button className="bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group text-left">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-600 group-hover:text-blue-700" />
            <div>
              <p className="font-medium text-gray-900">AI Consultation</p>
              <p className="text-sm text-gray-500">Get nutrition advice</p>
            </div>
          </div>
        </button>

        <Link
          to="/profile"
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-600 group-hover:text-purple-700" />
            <div>
              <p className="font-medium text-gray-900">My Profile</p>
              <p className="text-sm text-gray-500">Update preferences</p>
            </div>
          </div>
        </Link>

        <button className="bg-white rounded-lg p-4 border border-gray-200 hover:border-orange-300 hover:shadow-md transition-all group text-left">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-orange-600 group-hover:text-orange-700" />
            <div>
              <p className="font-medium text-gray-900">Order History</p>
              <p className="text-sm text-gray-500">Track your orders</p>
            </div>
          </div>
        </button>
      </div>

      {/* Recent Suppliers */}
      {recentSuppliers.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Suppliers Near You</h2>
            <Link 
              to="/search"
              className="text-emerald-600 hover:text-emerald-700 font-medium text-sm flex items-center gap-1"
            >
              View All <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentSuppliers.slice(0, 6).map((supplier) => (
              <div key={supplier.id} className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-gray-900 text-sm">{supplier.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium text-gray-700">{supplier.rating_average}</span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-xs mb-2 line-clamp-2">
                  {supplier.location_address}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{supplier.category}</span>
                  <Link
                    to={`/supplier/${supplier.id}`}
                    className="text-emerald-600 hover:text-emerald-700 text-xs font-medium"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tips & Recommendations */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6 border border-emerald-200">
        <h2 className="text-lg font-bold text-emerald-900 mb-4">
          💡 Tip of the Day
        </h2>
        <p className="text-emerald-800 mb-4">
          When transitioning to raw food, start with small amounts mixed with your pet's current food. 
          Gradually increase the raw portion over 7-10 days to avoid digestive upset.
        </p>
        <div className="flex gap-4">
          <Link
            to="/search"
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            Find Suppliers
          </Link>
          <button className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Learn More
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;