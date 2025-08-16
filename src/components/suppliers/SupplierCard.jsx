import React from 'react';
import { Star, MapPin, Truck, Phone, Clock, ChevronRight, ExternalLink } from 'lucide-react';
import { usePaws } from '../../contexts/PawsContext';
import { useAuth } from '../../contexts/AuthContext';

const SupplierCard = ({ supplier, onViewDetails, onGetDirections }) => {
  const { isAuthenticated } = useAuth();
  const { calculateOrderReward, formatPawsAmount } = usePaws();

  // Calculate estimated PAWS reward
  const earnRate = calculateOrderReward(supplier.average_order_amount || 50, supplier.paws_multiplier || 1);

  const handleViewDetails = () => {
    onViewDetails?.(supplier);
  };

  const handleGetDirections = () => {
    onGetDirections?.(supplier);
  };

  const handleCallSupplier = () => {
    if (supplier.phone_number) {
      window.open(`tel:${supplier.phone_number}`, '_self');
    }
  };

  const formatDistance = (distance) => {
    if (!distance) return '';
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)} mi`;
  };

  const formatHours = (hours) => {
    if (!hours) return 'Hours not available';
    
    const now = new Date();
    const day = now.toLocaleLowerCase().substring(0, 3); // mon, tue, etc.
    const todayHours = hours[day];
    
    if (!todayHours) return 'Closed today';
    if (todayHours.closed) return 'Closed today';
    
    return `${todayHours.open} - ${todayHours.close}`;
  };

  const isOpen = (hours) => {
    if (!hours) return null;
    
    const now = new Date();
    const day = now.toLocaleLowerCase().substring(0, 3);
    const todayHours = hours[day];
    
    if (!todayHours || todayHours.closed) return false;
    
    const currentTime = now.getHours() * 100 + now.getMinutes();
    const openTime = parseInt(todayHours.open.replace(':', ''));
    const closeTime = parseInt(todayHours.close.replace(':', ''));
    
    return currentTime >= openTime && currentTime <= closeTime;
  };

  const openStatus = isOpen(supplier.business_hours);

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <img 
          src={supplier.image_url || '/api/placeholder/400/200'} 
          alt={supplier.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = '/api/placeholder/400/200';
          }}
        />
        
        {/* Overlay badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {supplier.is_featured && (
            <div className="bg-gradient-to-r from-amber-400 to-yellow-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              ⭐ Featured Partner
            </div>
          )}
          {supplier.is_verified && (
            <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
              ✓ Verified
            </div>
          )}
        </div>

        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {supplier.delivery_available && (
            <div className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-medium text-gray-700">
              <Truck className="w-4 h-4 inline mr-1" />
              Delivery
            </div>
          )}
          {openStatus !== null && (
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              openStatus 
                ? 'bg-green-100 text-green-700' 
                : 'bg-red-100 text-red-700'
            }`}>
              <Clock className="w-4 h-4 inline mr-1" />
              {openStatus ? 'Open' : 'Closed'}
            </div>
          )}
        </div>
      </div>

      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
              {supplier.name}
            </h3>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              {supplier.distance && (
                <>
                  <MapPin className="w-4 h-4" />
                  <span>{formatDistance(supplier.distance)}</span>
                  <span>•</span>
                </>
              )}
              <span>{supplier.business_type || 'Supplier'}</span>
            </div>
          </div>
          
          {supplier.average_rating && (
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span className="font-bold text-gray-900">{supplier.average_rating.toFixed(1)}</span>
              <span className="text-sm text-gray-500">({supplier.review_count || 0})</span>
            </div>
          )}
        </div>

        {/* Description */}
        <p className="text-gray-600 mb-4 line-clamp-2">
          {supplier.description || 'Quality raw dog food supplier offering premium products for your pet.'}
        </p>

        {/* Business Hours */}
        {supplier.business_hours && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Clock className="w-4 h-4" />
            <span>{formatHours(supplier.business_hours)}</span>
          </div>
        )}

        {/* Specialties */}
        {supplier.specialties && supplier.specialties.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {supplier.specialties.slice(0, 3).map((specialty, idx) => (
              <span key={idx} className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm">
                {specialty}
              </span>
            ))}
            {supplier.specialties.length > 3 && (
              <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-sm">
                +{supplier.specialties.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* PAWS Rewards */}
        {isAuthenticated && (
          <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-lg">🐾</span>
                <span className="font-medium text-amber-900">
                  Earn {formatPawsAmount(earnRate)} PAWS per order
                </span>
              </div>
              <span className="text-sm text-amber-600">
                ~${supplier.average_order_amount || 50} avg
              </span>
            </div>
            {supplier.paws_multiplier > 1 && (
              <div className="text-xs text-amber-700 mt-1">
                {supplier.paws_multiplier}x PAWS multiplier active!
              </div>
            )}
          </div>
        )}

        {/* Contact Information */}
        {supplier.phone_number && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Phone className="w-4 h-4" />
            <button
              onClick={handleCallSupplier}
              className="hover:text-emerald-600 transition-colors"
            >
              {supplier.phone_number}
            </button>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={handleViewDetails}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            View Details
            <ChevronRight className="w-4 h-4" />
          </button>
          
          <button
            onClick={handleGetDirections}
            className="flex-1 border border-emerald-600 text-emerald-600 hover:bg-emerald-50 py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
          >
            <ExternalLink className="w-4 h-4" />
            Directions
          </button>
        </div>

        {/* Additional Actions */}
        <div className="flex gap-3 mt-3">
          {supplier.website_url && (
            <a
              href={supplier.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center text-emerald-600 hover:text-emerald-700 py-2 text-sm font-medium transition-colors"
            >
              Visit Website
            </a>
          )}
          
          {supplier.phone_number && (
            <button
              onClick={handleCallSupplier}
              className="flex-1 text-center text-emerald-600 hover:text-emerald-700 py-2 text-sm font-medium transition-colors"
            >
              Call Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierCard;