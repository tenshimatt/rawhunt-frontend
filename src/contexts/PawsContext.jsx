import React, { createContext, useContext, useState, useEffect } from 'react';
import { pawsAPI, apiUtils } from '../services/api';
import { useAuth } from './AuthContext';

const PawsContext = createContext({});

export const usePaws = () => {
  const context = useContext(PawsContext);
  if (!context) {
    throw new Error('usePaws must be used within a PawsProvider');
  }
  return context;
};

export const PawsProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [rewardRates, setRewardRates] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch balance when user logs in
  useEffect(() => {
    if (isAuthenticated) {
      fetchBalance();
      fetchRewardRates();
    } else {
      setBalance(0);
      setTransactions([]);
      setRewardRates({});
    }
  }, [isAuthenticated]);

  const fetchBalance = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pawsAPI.getBalance();
      setBalance(response.data.balance);
      
      return response.data.balance;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('Failed to fetch PAWS balance:', error);
      return 0;
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page = 1, limit = 20) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pawsAPI.getTransactions(page, limit);
      
      if (page === 1) {
        setTransactions(response.data.transactions);
      } else {
        setTransactions(prev => [...prev, ...response.data.transactions]);
      }
      
      return response.data;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('Failed to fetch transactions:', error);
      return { transactions: [], pagination: {} };
    } finally {
      setLoading(false);
    }
  };

  const fetchRewardRates = async () => {
    try {
      const response = await pawsAPI.getRewardRates();
      setRewardRates(response.data.rates);
      return response.data.rates;
    } catch (error) {
      console.error('Failed to fetch reward rates:', error);
      return {};
    }
  };

  const transferPaws = async (recipientId, amount, description) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await pawsAPI.transfer(recipientId, amount, description);
      
      // Update balance after successful transfer
      setBalance(response.data.balanceAfter);
      
      // Add transaction to local state
      const newTransaction = {
        id: response.data.transactionId,
        type: 'transferred',
        amount: -amount,
        description: description || `Transfer to user ${recipientId}`,
        created_at: new Date().toISOString(),
        balance_after: response.data.balanceAfter,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const earnReward = async (type, referenceId, amount) => {
    try {
      const response = await pawsAPI.earnReward(type, referenceId, amount);
      
      // Update balance after earning reward
      setBalance(response.data.balanceAfter);
      
      // Add transaction to local state
      const newTransaction = {
        id: response.data.transactionId,
        type: 'earned',
        amount: amount,
        description: response.data.description,
        created_at: new Date().toISOString(),
        balance_after: response.data.balanceAfter,
      };
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      console.error('Failed to earn reward:', error);
      return { success: false, error: errorMessage };
    }
  };

  // Calculate estimated PAWS reward for an order
  const calculateOrderReward = (orderAmount, supplierMultiplier = 1) => {
    const baseRate = rewardRates.order_percentage || 0.1; // 10% default
    return Math.round(orderAmount * baseRate * supplierMultiplier);
  };

  // Calculate estimated PAWS reward for a review
  const calculateReviewReward = () => {
    return rewardRates.review_amount || 50; // 50 PAWS default
  };

  // Format PAWS amount for display
  const formatPawsAmount = (amount) => {
    return amount?.toLocaleString() || '0';
  };

  // Get transaction type display info
  const getTransactionTypeInfo = (transaction) => {
    const typeMap = {
      earned: { 
        label: 'Earned', 
        color: 'text-green-600', 
        icon: '🎉',
        prefix: '+' 
      },
      transferred: { 
        label: 'Transferred', 
        color: 'text-red-600', 
        icon: '📤',
        prefix: '-' 
      },
      received: { 
        label: 'Received', 
        color: 'text-blue-600', 
        icon: '📥',
        prefix: '+' 
      },
      spent: { 
        label: 'Spent', 
        color: 'text-orange-600', 
        icon: '🛒',
        prefix: '-' 
      },
    };

    return typeMap[transaction.type] || {
      label: 'Transaction',
      color: 'text-gray-600',
      icon: '💰',
      prefix: ''
    };
  };

  const clearError = () => setError(null);

  // Refresh all PAWS data
  const refresh = async () => {
    if (isAuthenticated) {
      await Promise.all([
        fetchBalance(),
        fetchTransactions(1, 20),
        fetchRewardRates(),
      ]);
    }
  };

  const value = {
    balance,
    transactions,
    rewardRates,
    loading,
    error,
    fetchBalance,
    fetchTransactions,
    transferPaws,
    earnReward,
    calculateOrderReward,
    calculateReviewReward,
    formatPawsAmount,
    getTransactionTypeInfo,
    clearError,
    refresh,
  };

  return (
    <PawsContext.Provider value={value}>
      {children}
    </PawsContext.Provider>
  );
};