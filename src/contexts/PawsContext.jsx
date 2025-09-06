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
  const [isInitialized, setIsInitialized] = useState(false);

  // Fetch balance when user logs in (with initialization guard)
  useEffect(() => {
    let isMounted = true;
    
    if (isAuthenticated && !isInitialized) {
      console.log('🔄 Initializing reward points data...');
      setIsInitialized(true);
      
      const initializeRewardPoints = async () => {
        if (isMounted) {
          await fetchBalance();
          // fetchRewardRates(); // TODO: Backend endpoint not implemented yet
        }
      };
      
      initializeRewardPoints();
    } else if (!isAuthenticated) {
      setBalance(0);
      setTransactions([]);
      setRewardRates({});
      setIsInitialized(false);
    }
    
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated]);

  const fetchBalance = async () => {
    if (loading) {
      console.log('⚠️ Points balance fetch already in progress, skipping...');
      return balance;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('🔍 Fetching reward points balance...');
      
      const response = await pawsAPI.getBalance();
      setBalance(response.data.balance);
      console.log('✅ Reward points balance updated:', response.data.balance);
      
      return response.data.balance;
    } catch (error) {
      const errorMessage = apiUtils.handleError(error);
      setError(errorMessage);
      console.error('❌ Failed to fetch reward points balance:', error);
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

  // Removed fetchRewardRates - backend endpoint not implemented
  const fetchRewardRates = async () => {
    console.log('fetchRewardRates called but disabled - backend endpoint not implemented');
    return {};
  };

  const transferPoints = async (recipientId, amount, description) => {
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

  // Calculate estimated reward points for an order
  const calculateOrderReward = (orderAmount, supplierMultiplier = 1) => {
    const baseRate = rewardRates.order_percentage || 0.1; // 10% default
    return Math.round(orderAmount * baseRate * supplierMultiplier);
  };

  // Calculate estimated reward points for a review
  const calculateReviewReward = () => {
    return rewardRates.review_amount || 50; // 50 points default
  };

  // Format reward points amount for display
  const formatPointsAmount = (amount) => {
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

  // Refresh all reward points data
  const refresh = async () => {
    if (isAuthenticated) {
      await Promise.all([
        fetchBalance(),
        fetchTransactions(1, 20),
        // fetchRewardRates(), // TODO: Backend endpoint not implemented yet
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
    transferPoints,
    earnReward,
    calculateOrderReward,
    calculateReviewReward,
    formatPointsAmount,
    getTransactionTypeInfo,
    clearError,
    refresh,
    // Legacy aliases for backward compatibility
    transferPaws: transferPoints,
    formatPawsAmount: formatPointsAmount,
  };

  return (
    <PawsContext.Provider value={value}>
      {children}
    </PawsContext.Provider>
  );
};