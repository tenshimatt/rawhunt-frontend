import React, { useState, useEffect } from 'react';
import { Award, TrendingUp, Gift, History, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { pawsAPI, apiUtils } from '../services/api';

const PAWSPage = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPAWSData();
  }, []);

  const loadPAWSData = async () => {
    if (!user || !apiUtils.isAuthenticated()) return;

    try {
      setLoading(true);
      setError('');
      
      // Load balance
      const balanceResponse = await pawsAPI.getBalance();
      if (balanceResponse.success && balanceResponse.data) {
        setBalance(balanceResponse.data.balance || 0);
      }

      // Load recent transactions
      const transactionsResponse = await pawsAPI.getTransactions(1, 20);
      if (transactionsResponse.success && transactionsResponse.data) {
        setTransactions(transactionsResponse.data.transactions || []);
      }

    } catch (err) {
      console.error('Error loading PAWS data:', err);
      setError(apiUtils.handleError(err));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          PAWS Reward Points 🐾
        </h1>
        <p className="text-gray-600">
          Earn points by engaging with the platform and redeem them for rewards
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl p-8 border border-amber-200 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl">🐾</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-amber-900">Your Balance</h2>
                <p className="text-amber-700 text-sm">Available reward points</p>
              </div>
            </div>
            <p className="text-4xl font-bold text-amber-900">{balance.toLocaleString()}</p>
          </div>
          <button
            onClick={loadPAWSData}
            className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Earned</p>
              <p className="text-2xl font-bold text-gray-900">{balance}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-600 bg-green-50 rounded-full p-2" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Transactions</p>
              <p className="text-2xl font-bold text-gray-900">{transactions.length}</p>
            </div>
            <History className="w-10 h-10 text-blue-600 bg-blue-50 rounded-full p-2" />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Rewards Level</p>
              <p className="text-2xl font-bold text-gray-900">
                {balance < 100 ? 'Bronze' : balance < 500 ? 'Silver' : balance < 1000 ? 'Gold' : 'Platinum'}
              </p>
            </div>
            <Award className="w-10 h-10 text-purple-600 bg-purple-50 rounded-full p-2" />
          </div>
        </div>
      </div>

      {/* How to Earn Points */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Earn PAWS Points</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-lg">
            <div className="w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✍️</span>
            </div>
            <div>
              <p className="font-medium text-emerald-900">Write Reviews</p>
              <p className="text-sm text-emerald-700">Earn 50 points per review</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">🛒</span>
            </div>
            <div>
              <p className="font-medium text-blue-900">Make Purchases</p>
              <p className="text-sm text-blue-700">Earn 1% back in points</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👥</span>
            </div>
            <div>
              <p className="font-medium text-purple-900">Refer Friends</p>
              <p className="text-sm text-purple-700">Earn 100 points per referral</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">✅</span>
            </div>
            <div>
              <p className="font-medium text-orange-900">Complete Profile</p>
              <p className="text-sm text-orange-700">One-time 25 point bonus</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
            View All
          </button>
        </div>

        {transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.slice(0, 10).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    transaction.type === 'earned' 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {transaction.type === 'earned' 
                      ? <ArrowUpRight className="w-4 h-4" />
                      : <ArrowDownRight className="w-4 h-4" />
                    }
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className={`font-semibold ${
                  transaction.type === 'earned' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'earned' ? '+' : '-'}{transaction.amount}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <History className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-2">No transactions yet</p>
            <p className="text-sm text-gray-400">Start earning points by writing reviews and making purchases</p>
          </div>
        )}
      </div>

      {/* Rewards Redemption - Coming Soon */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200 p-6 mt-8 text-center">
        <Gift className="w-12 h-12 text-purple-600 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-purple-900 mb-2">Rewards Redemption Coming Soon</h3>
        <p className="text-purple-700 mb-4">
          Soon you'll be able to redeem your PAWS points for discounts, free products, and exclusive perks!
        </p>
        <div className="flex flex-wrap justify-center gap-2 text-sm">
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Supplier Discounts</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Free Shipping</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Premium Features</span>
          <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full">Exclusive Access</span>
        </div>
      </div>
    </div>
  );
};

export default PAWSPage;