import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Loader, X, MessageSquare } from 'lucide-react';
import { chatAPI, apiUtils } from '../services/api';

const ChatInterface = ({ isOpen, onClose, user }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Add welcome message when chat opens
      setMessages([
        {
          id: Date.now(),
          text: "Hi! I'm Claude, your AI assistant for raw pet feeding. I can help you with nutrition advice, feeding schedules, transitioning your pet to raw food, and finding the right suppliers. How can I help you today?",
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage.trim(),
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setError('');

    try {
      // Prepare context for Claude AI
      const context = {
        userProfile: user ? {
          name: user.name,
          email: user.email,
          pawsBalance: user.pawsBalance,
        } : null,
        conversationHistory: messages.slice(-5), // Last 5 messages for context
      };

      const response = await chatAPI.sendMessage(inputMessage.trim(), context);

      if (response.success && response.data) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.response || response.data.message,
          isBot: true,
          timestamp: new Date(),
          context: response.data.context || {},
        };

        setMessages(prev => [...prev, botMessage]);
      } else {
        throw new Error(response.error || 'Failed to get AI response');
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError(apiUtils.handleError(err));
      
      // Add error message to chat
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble responding right now. Please try again in a moment.",
        isBot: true,
        timestamp: new Date(),
        isError: true,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md h-96 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-t-xl">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold">Claude AI</h3>
              <p className="text-sm text-emerald-100">Raw Feeding Assistant</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
            >
              <div className={`max-w-[80%] ${message.isBot ? 'order-2' : 'order-1'}`}>
                <div
                  className={`px-3 py-2 rounded-lg ${
                    message.isBot
                      ? message.isError
                        ? 'bg-red-100 text-red-800'
                        : 'bg-gray-100 text-gray-800'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                </div>
                <div className={`text-xs text-gray-500 mt-1 ${
                  message.isBot ? 'text-left' : 'text-right'
                }`}>
                  {formatTime(message.timestamp)}
                </div>
              </div>
              {message.isBot && (
                <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2 order-1 flex-shrink-0">
                  <Bot className="w-4 h-4 text-emerald-600" />
                </div>
              )}
              {!message.isBot && (
                <div className="w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center ml-2 order-2 flex-shrink-0">
                  <User className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center mr-2 flex-shrink-0">
                <Bot className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="bg-gray-100 px-3 py-2 rounded-lg">
                <div className="flex items-center gap-1">
                  <Loader className="w-4 h-4 animate-spin text-gray-500" />
                  <span className="text-sm text-gray-500">Claude is thinking...</span>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Error Message */}
        {error && (
          <div className="px-4 py-2 bg-red-50 border-t border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Input */}
        <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Ask about raw feeding, nutrition, suppliers..."
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 text-white rounded-lg transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;