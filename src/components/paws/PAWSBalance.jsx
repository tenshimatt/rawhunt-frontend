import React, { useEffect } from 'react';
import { TrendingUp, Wallet, Gift, ArrowUpRight } from 'lucide-react';
import { usePaws } from '../../contexts/PawsContext';
import { useAuth } from '../../contexts/AuthContext';

const PAWSBalance = ({ showDetails = false, className = '', onClick }) => {
  const { user, isAuthenticated } = useAuth();
  const { balance, loading, error, fetchBalance, formatPawsAmount } = usePaws();

  // Refresh balance periodically when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial fetch
    fetchBalance();

    // Set up interval for periodic updates (every 30 seconds)
    const interval = setInterval(() => {
      fetchBalance();
    }, 30000);

    return () => clearInterval(interval);
  }, [isAuthenticated, fetchBalance]);

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className={`flex items-center gap-2 bg-red-50 px-4 py-2 rounded-lg border border-red-200 ${className}`}>
        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-xs text-red-600">!</span>
        </div>
        <div>
          <div className="text-xs text-red-600">PAWS Error</div>
          <div className="text-xs text-red-500">Unable to load</div>
        </div>
      </div>
    );
  }

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  if (showDetails) {
    return (
      <div className={`bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-6 ${className}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-lg">🐾</span>
            </div>
            <div>
              <h3 className="font-bold text-amber-900">PAWS Balance</h3>
              <p className="text-sm text-amber-700">Your reward points</p>
            </div>
          </div>
          <button
            onClick={handleClick}
            className="text-amber-600 hover:text-amber-700 p-2 rounded-lg hover:bg-amber-100 transition-colors"
          >
            <ArrowUpRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-2xl font-bold text-amber-900">Loading...</span>
            </div>
          ) : (
            <div className="text-3xl font-bold text-amber-900">
              {formatPawsAmount(balance)}
            </div>
          )}
        </div>

        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-white/50 rounded-lg p-3">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-xs text-amber-700">Earned</div>
            <div className="font-semibold text-amber-900">This Week</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Wallet className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-xs text-amber-700">Total</div>
            <div className="font-semibold text-amber-900">Lifetime</div>
          </div>
          <div className="bg-white/50 rounded-lg p-3">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Gift className="w-4 h-4 text-purple-600" />
            </div>
            <div className="text-xs text-amber-700">Rewards</div>
            <div className="font-semibold text-amber-900">Available</div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-amber-200">
          <div className="flex items-center justify-between text-sm">
            <span className="text-amber-700">Next reward at:</span>
            <span className="font-medium text-amber-900">
              {formatPawsAmount(Math.ceil((balance + 1) / 100) * 100)} PAWS
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Compact version for navigation
  return (
    <button
      onClick={handleClick}
      className={`flex items-center gap-2 bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 rounded-lg border border-amber-200 hover:from-amber-100 hover:to-yellow-100 transition-all duration-200 ${className}`}
    >
      <div className="w-6 h-6 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
        <span className="text-xs">🐾</span>
      </div>
      <div className="text-left">
        <div className="text-xs text-amber-600">PAWS Balance</div>
        {loading ? (
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 border border-amber-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-xs text-amber-700">Loading...</span>
          </div>
        ) : (
          <div className="font-bold text-amber-900">{formatPawsAmount(balance)}</div>
        )}
      </div>
    </button>
  );
};

export default PAWSBalance;