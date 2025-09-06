import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  Truck, 
  Phone, 
  Clock, 
  ExternalLink,
  Globe,
  Mail,
  Award,
  Shield,
  Plus,
  Edit3,
  AlertCircle
} from 'lucide-react';
import { StarRating, ReviewForm, ReviewList } from '../reviews';
import { suppliersAPI } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { usePaws } from '../../contexts/PawsContext';

/**
 * Supplier Detail Page with Full Review System Integration
 * 
 * Props:
 * - supplierId: ID of the supplier to display
 * - onBack: Callback when user wants to go back
 */
const SupplierDetailPage = ({ supplierId, onBack }) => {
  const { user, isAuthenticated } = useAuth();
  const { calculateOrderReward, formatPawsAmount } = usePaws();
  
  const [supplier, setSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (supplierId) {
      loadSupplierDetails();
    }
  }, [supplierId]);

  const loadSupplierDetails = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await suppliersAPI.getById(supplierId);
      if (response.success && response.data) {
        setSupplier(response.data.supplier || response.data);
      } else {
        setError('Supplier not found');
      }
    } catch (err) {
      console.error('Error loading supplier details:', err);
      setError('Failed to load supplier details');
    } finally {
      setLoading(false);
    }
  };

  const handleWriteReview = () => {
    if (!isAuthenticated) {
      alert('Please sign in to write a review');
      return;
    }
    setEditingReview(null);
    setShowReviewForm(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReviewSubmitted = (newReview) => {
    // Refresh supplier data to update review count and average rating
    loadSupplierDetails();
  };

  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)} mi`;
  };

  const formatHours = (hours) => {
    if (!hours) return 'Hours not available';
    
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const todayHours = hours[day];
    
    if (!todayHours) return 'Closed today';
    if (todayHours.closed) return 'Closed today';
    
    return `${todayHours.open} - ${todayHours.close}`;
  };

  const isOpen = (hours) => {
    if (!hours) return null;
    
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'short' }).toLowerCase();
    const todayHours = hours[day];
    
    if (!todayHours || todayHours.closed) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-600">Loading supplier details...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8 shadow-md max-w-md w-full mx-4 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Unable to Load Supplier</h3>
          <p className="text-gray-600 mb-4">{error || 'Supplier not found'}</p>
          <button
            onClick={onBack}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const openStatus = isOpen(supplier.business_hours);
  const earnRate = calculateOrderReward(supplier.average_order_amount || 50, supplier.paws_multiplier || 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 py-4">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to search</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-64 md:h-80">
            <img 
              src={supplier.image_url || '/api/placeholder/800/320'} 
              alt={supplier.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/api/placeholder/800/320';
              }}
            />
            
            {/* Hero Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {supplier.is_featured && (
                <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  ⭐ Featured Partner
                </div>
              )}
              {supplier.is_verified && (
                <div className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Verified Supplier
                </div>
              )}
            </div>

            <div className="absolute top-6 right-6 flex flex-col gap-2">
              {supplier.delivery_available && (
                <div className="bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-gray-700">
                  <Truck className="w-4 h-4 inline mr-2" />
                  Delivery Available
                </div>
              )}
              {openStatus !== null && (
                <div className={`px-4 py-2 rounded-full text-sm font-medium ${
                  openStatus 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  <Clock className="w-4 h-4 inline mr-2" />
                  {openStatus ? 'Open Now' : 'Closed'}
                </div>
              )}
            </div>

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
              <div className="text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{supplier.name}</h1>
                <div className="flex items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5" />
                    <span>{supplier.location_address || 'Address not available'}</span>
                  </div>
                  {supplier.distance && (
                    <>
                      <span>•</span>
                      <span>{formatDistance(supplier.distance)} away</span>
                    </>
                  )}
                </div>
                
                {supplier.average_rating && (
                  <div className="flex items-center gap-3">
                    <StarRating rating={supplier.average_rating} readonly size="md" />
                    <span className="font-bold text-lg">{supplier.average_rating.toFixed(1)}</span>
                    <span className="opacity-90">({supplier.review_count || 0} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tab Navigation */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="border-b border-gray-200">
                <nav className="flex">
                  {[
                    { id: 'overview', name: 'Overview' },
                    { id: 'reviews', name: 'Reviews' },
                    { id: 'photos', name: 'Photos' },
                    { id: 'hours', name: 'Hours' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.id
                          ? 'border-emerald-500 text-emerald-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      {tab.name}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-3">About</h3>
                      <p className="text-gray-700 leading-relaxed">
                        {supplier.description || 'Quality raw dog food supplier offering premium products for your pet. We are committed to providing the best nutrition for your furry family members.'}
                      </p>
                    </div>

                    {/* Specialties */}
                    {supplier.specialties && supplier.specialties.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Specialties</h3>
                        <div className="flex flex-wrap gap-2">
                          {supplier.specialties.map((specialty, idx) => (
                            <span key={idx} className="px-3 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium">
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Features */}
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Features</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {supplier.delivery_available && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Truck className="w-5 h-5 text-emerald-600" />
                            <span>Delivery Available</span>
                          </div>
                        )}
                        {supplier.is_verified && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Shield className="w-5 h-5 text-green-600" />
                            <span>Verified Supplier</span>
                          </div>
                        )}
                        {supplier.is_featured && (
                          <div className="flex items-center gap-2 text-gray-700">
                            <Award className="w-5 h-5 text-amber-600" />
                            <span>Featured Partner</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Customer Reviews</h3>
                      <button
                        onClick={handleWriteReview}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        Write Review
                      </button>
                    </div>
                    <ReviewList 
                      supplierId={supplierId}
                      onEditReview={handleEditReview}
                    />
                  </div>
                )}

                {/* Photos Tab */}
                {activeTab === 'photos' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Photos</h3>
                    <p className="text-gray-600">Photos from reviews and supplier gallery will be displayed here.</p>
                  </div>
                )}

                {/* Hours Tab */}
                {activeTab === 'hours' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Business Hours</h3>
                    {supplier.business_hours ? (
                      <div className="space-y-2">
                        {Object.entries(supplier.business_hours).map(([day, hours]) => (
                          <div key={day} className="flex justify-between items-center py-2 border-b border-gray-100">
                            <span className="font-medium capitalize">{day}</span>
                            <span className="text-gray-600">
                              {hours.closed ? 'Closed' : `${hours.open} - ${hours.close}`}
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">Business hours not available</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Contact & Actions */}
          <div className="space-y-6">
            {/* Contact Card */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
              
              <div className="space-y-4">
                {supplier.phone_number && (
                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5 text-gray-400" />
                    <a 
                      href={`tel:${supplier.phone_number}`}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {supplier.phone_number}
                    </a>
                  </div>
                )}
                
                {supplier.email && (
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <a 
                      href={`mailto:${supplier.email}`}
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      {supplier.email}
                    </a>
                  </div>
                )}
                
                {supplier.website_url && (
                  <div className="flex items-center gap-3">
                    <Globe className="w-5 h-5 text-gray-400" />
                    <a 
                      href={supplier.website_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 hover:text-emerald-700 transition-colors"
                    >
                      Visit Website
                    </a>
                  </div>
                )}

                {supplier.business_hours && (
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-gray-400" />
                    <span className="text-gray-700">{formatHours(supplier.business_hours)}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 mt-6">
                <button
                  onClick={() => window.open(`https://maps.google.com/?q=${supplier.location_address}`, '_blank')}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Get Directions
                </button>
                
                {supplier.phone_number && (
                  <button
                    onClick={() => window.open(`tel:${supplier.phone_number}`, '_self')}
                    className="w-full border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-3 rounded-lg font-medium transition-colors"
                  >
                    Call Now
                  </button>
                )}
              </div>
            </div>

            {/* PAWS Rewards Card */}
            {isAuthenticated && (
              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-lg p-6 border border-amber-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-yellow-500 rounded-full flex items-center justify-center">
                    <span className="text-white">🐾</span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-amber-900">PAWS Rewards</h3>
                    <p className="text-sm text-amber-700">Earn points with every order</p>
                  </div>
                </div>
                
                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-amber-900 mb-1">
                      {formatPawsAmount(earnRate)}
                    </div>
                    <div className="text-sm text-amber-700">
                      Points per order (~${supplier.average_order_amount || 50} avg)
                    </div>
                  </div>
                </div>
                
                {supplier.paws_multiplier > 1 && (
                  <div className="text-center text-sm text-amber-700 font-medium">
                    🎉 {supplier.paws_multiplier}x multiplier active!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Review Form Modal */}
      {showReviewForm && (
        <ReviewForm
          supplierId={supplierId}
          existingReview={editingReview}
          onClose={() => {
            setShowReviewForm(false);
            setEditingReview(null);
          }}
          onSuccess={handleReviewSubmitted}
        />
      )}
    </div>
  );
};

export default SupplierDetailPage;