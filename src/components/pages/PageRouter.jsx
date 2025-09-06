import React from 'react';
import { Package, Star, MessageSquare, DollarSign, MapPin, Bell, Settings, TrendingUp, User, ShieldCheck, Award, Users } from 'lucide-react';
import SupplierDetailPage from './SupplierDetailPage';
import UIDemo from '../../pages/UIDemo';

// Feature Status Indicator Component
const FeatureStatus = ({ status, title, description, children }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'working':
        return {
          color: 'text-green-600 bg-green-50 border-green-200',
          text: '✅ Working',
          bgClass: 'bg-green-50 border-green-200'
        };
      case 'ready':
        return {
          color: 'text-blue-600 bg-blue-50 border-blue-200',
          text: '🔧 Ready (needs setup)',
          bgClass: 'bg-blue-50 border-blue-200'
        };
      case 'partial':
        return {
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          text: '🚧 Partially Working',
          bgClass: 'bg-yellow-50 border-yellow-200'
        };
      case 'planned':
        return {
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          text: '📋 Planned',
          bgClass: 'bg-gray-50 border-gray-200'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          text: '❓ Unknown',
          bgClass: 'bg-gray-50 border-gray-200'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={`p-6 border-2 rounded-lg ${config.bgClass}`}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <span className={`px-3 py-1 text-sm font-medium rounded-full border ${config.color}`}>
          {config.text}
        </span>
      </div>
      <p className="text-gray-600 mb-4">{description}</p>
      {children}
    </div>
  );
};

// Individual Page Components
const SearchPage = ({ onBack }) => (
  <FeatureStatus 
    status="working" 
    title="Supplier Search" 
    description="Find raw pet food suppliers near you using geolocation search."
  >
    <div className="space-y-4">
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">✅ Currently Working:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Geolocation-based supplier search</li>
          <li>• Distance calculation and sorting</li>
          <li>• Supplier details and contact info</li>
          <li>• Search filters (category, rating, price range)</li>
        </ul>
      </div>
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">🚧 Known Issues:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Database only has Chicago-area suppliers currently</li>
          <li>• Need to import full 8,843 supplier dataset</li>
          <li>• Limited supplier coverage in other states</li>
        </ul>
      </div>
      <button onClick={onBack} className="px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-700">
        Go Back to Search
      </button>
    </div>
  </FeatureStatus>
);

const PAWSPage = ({ onBack, user }) => (
  <FeatureStatus 
    status="working" 
    title="Reward Points System" 
    description="Earn and spend reward points for platform engagement and rewards."
  >
    <div className="space-y-4">
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">✅ Currently Working:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Reward points balance tracking and display</li>
          <li>• Points earning for reviews and engagement</li>
          <li>• Transaction history logging</li>
          <li>• Reward system integration</li>
        </ul>
      </div>
      {user && (
        <div className="p-4 bg-white rounded border">
          <h3 className="font-medium mb-2">Your Reward Points Status:</h3>
          <div className="flex items-center gap-4">
            <div className="text-2xl">🐾</div>
            <div>
              <p className="font-bold">Balance: Loading...</p>
              <p className="text-sm text-gray-600">Earn more by writing reviews!</p>
            </div>
          </div>
        </div>
      )}
      <button onClick={onBack} className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700">
        Go Back
      </button>
    </div>
  </FeatureStatus>
);

const ReviewsPage = ({ onBack }) => (
  <FeatureStatus 
    status="working" 
    title="Reviews & Ratings System" 
    description="Rate suppliers and read reviews from other pet owners."
  >
    <div className="space-y-4">
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">✅ Fully Working:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Complete review submission and storage system</li>
          <li>• Interactive star rating components</li>
          <li>• Photo upload with drag-and-drop support</li>
          <li>• Review display with filtering and sorting</li>
          <li>• Rating aggregation and display</li>
          <li>• Reward points for reviews</li>
          <li>• Full supplier detail pages with integrated reviews</li>
        </ul>
      </div>
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">🎯 Key Features:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• StarRating - Interactive star rating widget</li>
          <li>• ReviewForm - Full review submission with validation</li>
          <li>• ReviewCard - Individual review display with actions</li>
          <li>• ReviewList - Paginated list with filters</li>
          <li>• PhotoUpload - Drag-and-drop photo upload</li>
          <li>• SupplierDetailPage - Complete supplier page with reviews</li>
        </ul>
      </div>
      <button onClick={onBack} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Go Back
      </button>
    </div>
  </FeatureStatus>
);

const ChatPage = ({ onBack }) => (
  <FeatureStatus 
    status="ready" 
    title="Claude AI Chat" 
    description="AI-powered pet nutrition advice and supplier recommendations."
  >
    <div className="space-y-4">
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">🔧 Ready for Setup:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Complete chat API integration</li>
          <li>• Pet nutrition specialization</li>
          <li>• Conversation history tracking</li>
          <li>• Reward points for engagement</li>
        </ul>
      </div>
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">⚠️ Needs Configuration:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• ANTHROPIC_API_KEY environment variable</li>
          <li>• KV namespace setup for caching</li>
          <li>• Rate limiting configuration</li>
        </ul>
      </div>
      <button onClick={onBack} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Test Chat (when configured)
      </button>
    </div>
  </FeatureStatus>
);

const MapPage = ({ onBack }) => (
  <FeatureStatus 
    status="working" 
    title="Interactive Supplier Map" 
    description="Explore suppliers on an interactive map with location pins."
  >
    <div className="space-y-4">
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">✅ Currently Working:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Interactive map display</li>
          <li>• Supplier location pins</li>
          <li>• Click for supplier details</li>
          <li>• Responsive map controls</li>
        </ul>
      </div>
      <button onClick={onBack} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Go Back to Map
      </button>
    </div>
  </FeatureStatus>
);

const ProfilePage = ({ onBack }) => (
  <FeatureStatus 
    status="planned" 
    title="User Profile Settings" 
    description="Manage your account settings, preferences, and profile information."
  >
    <div className="space-y-4">
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">📋 Planned Features:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Profile information editing</li>
          <li>• Pet profile management</li>
          <li>• Notification preferences</li>
          <li>• Privacy settings</li>
          <li>• Location preferences</li>
        </ul>
      </div>
      <button onClick={onBack} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        Go Back
      </button>
    </div>
  </FeatureStatus>
);

const AdminPage = ({ onBack, section = 'overview' }) => (
  <FeatureStatus 
    status="planned" 
    title="Admin Dashboard" 
    description="Platform administration and management tools."
  >
    <div className="space-y-4">
      <div className="p-4 bg-white rounded border">
        <h3 className="font-medium mb-2">📋 Planned Admin Features:</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-emerald-600 mb-2">User Management</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• User account oversight</li>
              <li>• Role and permission management</li>
              <li>• Account suspension/activation</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-emerald-600 mb-2">Supplier Management</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Supplier verification workflow</li>
              <li>• Data quality monitoring</li>
              <li>• Duplicate detection and cleanup</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-emerald-600 mb-2">Points Management</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Points distribution monitoring</li>
              <li>• Fraud prevention controls</li>
              <li>• Reward system configuration</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium text-emerald-600 mb-2">Analytics</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Platform usage metrics</li>
              <li>• User engagement tracking</li>
              <li>• Performance monitoring</li>
            </ul>
          </div>
        </div>
      </div>
      <button onClick={onBack} className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
        Go Back
      </button>
    </div>
  </FeatureStatus>
);

const PlaceholderPage = ({ title, status, description, onBack }) => (
  <FeatureStatus status={status} title={title} description={description}>
    <div className="space-y-4">
      <div className="p-4 bg-white rounded border">
        <p className="text-sm text-gray-600">This feature is currently in development.</p>
      </div>
      <button onClick={onBack} className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700">
        Go Back
      </button>
    </div>
  </FeatureStatus>
);

const PageRouter = ({ currentPage, onBack, user, supplierId }) => {
  const renderPage = () => {
    switch (currentPage) {
      case 'search':
        return <SearchPage onBack={onBack} />;
      case 'paws':
        return <PAWSPage onBack={onBack} user={user} />;
      case 'reviews':
        return <ReviewsPage onBack={onBack} />;
      case 'chat':
        return <ChatPage onBack={onBack} />;
      case 'map':
        return <MapPage onBack={onBack} />;
      case 'supplier-detail':
        return <SupplierDetailPage supplierId={supplierId} onBack={onBack} />;
      case 'ui-demo':
        return <UIDemo />;
      case 'notifications':
        return <PlaceholderPage 
          title="Notifications" 
          status="partial" 
          description="Stay updated with platform alerts and notifications." 
          onBack={onBack} 
        />;
      case 'profile':
        return <ProfilePage onBack={onBack} />;
      case 'orders':
        return <PlaceholderPage 
          title="Order History" 
          status="planned" 
          description="View your past orders and purchases." 
          onBack={onBack} 
        />;
      case 'my-reviews':
        return <PlaceholderPage 
          title="My Reviews" 
          status="planned" 
          description="Reviews and ratings you've submitted." 
          onBack={onBack} 
        />;
      case 'transactions':
        return <PlaceholderPage 
          title="Transaction History" 
          status="working" 
          description="Your reward points transaction history." 
          onBack={onBack} 
        />;
      case 'admin/users':
      case 'admin/suppliers':
      case 'admin/analytics':
      case 'admin/paws':
        return <AdminPage onBack={onBack} section={currentPage.split('/')[1]} />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {renderPage()}
    </div>
  );
};

export default PageRouter;