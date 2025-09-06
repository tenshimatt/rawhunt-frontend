import React, { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { Menu, MessageSquare, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { pawsAPI, apiUtils } from '../../services/api';
import MainMenu from '../navigation/MainMenu';
// import ChatInterface from '../ChatInterface'; // Temporarily disabled for deployment

// Reward Points Display Component
const PAWSBalance = ({ balance = 0, loading = false, onClick }) => {
  return (
    <button 
      onClick={onClick}
      className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 rounded-lg border border-amber-200 hover:border-amber-300 transition-colors cursor-pointer"
    >
      <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
        <span className="text-xs">🐾</span>
      </div>
      <div>
        <div className="text-xs text-amber-600">Reward Points</div>
        <div className="font-bold text-amber-900">
          {loading ? '...' : balance.toLocaleString()}
        </div>
      </div>
    </button>
  );
};

const MainLayout = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [pawsBalance, setPawsBalance] = useState(0);
  const [pawsLoading, setPawsLoading] = useState(false);

  // Load PAWS balance
  const loadPawsBalance = async () => {
    if (!user || !apiUtils.isAuthenticated()) return;
    
    setPawsLoading(true);
    try {
      const response = await pawsAPI.getBalance();
      if (response.success && response.data) {
        setPawsBalance(response.data.balance || 0);
      }
    } catch (err) {
      console.error('Error loading PAWS balance:', err);
    } finally {
      setPawsLoading(false);
    }
  };

  // Load PAWS balance when user changes
  useEffect(() => {
    if (user && apiUtils.isAuthenticated()) {
      loadPawsBalance();
    } else {
      setPawsBalance(0);
    }
  }, [user]);

  const handleNavigate = (page) => {
    setShowMenu(false);
    
    switch (page) {
      case 'login':
        navigate('/auth/login');
        break;
      case 'register':
        navigate('/auth/register');
        break;
      case 'chat':
        setShowChat(true);
        break;
      case 'logout':
        logout();
        navigate('/');
        break;
      case 'search':
        navigate('/');
        break;
      case 'dashboard':
        navigate('/dashboard');
        break;
      case 'profile':
        navigate('/profile');
        break;
      case 'paws':
        navigate('/paws');
        break;
      default:
        // Handle other navigation cases
        break;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left side with menu and logo */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setShowMenu(true)}
                className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Open Menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <Link to="/" className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">R</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Rawgle</h1>
                  <p className="text-xs text-gray-500">Raw Feeding Community. For the love of our Pets!</p>
                </div>
              </Link>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              {user && (
                <PAWSBalance 
                  balance={pawsBalance} 
                  loading={pawsLoading} 
                  onClick={loadPawsBalance}
                />
              )}
              
              {/* Notifications */}
              <button className="text-gray-600 hover:text-gray-900 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
              </button>
              
              {/* User Menu */}
              {isAuthenticated ? (
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
                  <Link
                    to="/auth/login"
                    className="border border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/auth/register"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* MainMenu Component */}
      <MainMenu
        user={user}
        isOpen={showMenu}
        onClose={() => setShowMenu(false)}
        onNavigate={handleNavigate}
      />

      {/* Floating Chat Button */}
      {user && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Chat Interface - Temporarily disabled for deployment
      <ChatInterface 
        isOpen={showChat}
        onClose={() => setShowChat(false)}
        user={user}
      />
      */}
    </div>
  );
};

export default MainLayout;