import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ProductionMap = ({ suppliers = [], onLocationFound, onSupplierClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  // Production map initialization - exact copy from rawgle.com
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize map with same settings as production
    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
    
    // Use exact same tile layer as production
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    // Auto-detect user location on load
    getUserLocationWithGPS();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // GPS location detection - exact copy from production
  const getUserLocationWithGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setView([latitude, longitude], 10);
            
            // Add user location marker with exact production styling
            if (userMarkerRef.current) {
              userMarkerRef.current.remove();
            }
            
            userMarkerRef.current = L.marker([latitude, longitude], {
              icon: createUserIcon(true)
            }).addTo(mapInstanceRef.current);
          }
          
          // Notify parent component
          if (onLocationFound) {
            onLocationFound({ latitude, longitude });
          }
        },
        (error) => {
          console.log('GPS location failed, trying IP location');
          getIPLocation();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      getIPLocation();
    }
  };

  // IP-based location fallback - from production
  const getIPLocation = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.latitude && data.longitude) {
        const location = { lat: data.latitude, lng: data.longitude };
        setUserLocation(location);
        
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([data.latitude, data.longitude], 10);
          
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }
          
          userMarkerRef.current = L.marker([data.latitude, data.longitude], {
            icon: createUserIcon(false)
          }).addTo(mapInstanceRef.current);
        }
        
        if (onLocationFound) {
          onLocationFound({ latitude: data.latitude, longitude: data.longitude });
        }
      }
    } catch (error) {
      console.log('IP location failed:', error);
    }
  };

  // Create custom supplier icon - exact from production
  const createCustomIcon = () => {
    return L.divIcon({
      html: '<div style="background: #D4A574; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">🦴</div>',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
      className: 'custom-marker'
    });
  };

  // Create user location icon - exact from production
  const createUserIcon = (isPrecise = false) => {
    const size = isPrecise ? 16 : 24;
    const color = isPrecise ? '#00aa00' : '#ff4444';
    const title = isPrecise ? 'Your precise location' : 'Your approximate location';
    return L.divIcon({
      html: `<div style="background: ${color}; width: ${size}px; height: ${size}px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); animation: pulse 2s infinite;" title="${title}"></div>`,
      iconSize: [size, size],
      iconAnchor: [size/2, size/2],
      className: 'user-location-marker'
    });
  };

  // Load suppliers onto map - production logic
  useEffect(() => {
    if (!mapInstanceRef.current || !suppliers.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add supplier markers
    suppliers.forEach(supplier => {
      if (supplier.location_latitude && supplier.location_longitude) {
        const marker = L.marker(
          [supplier.location_latitude, supplier.location_longitude],
          { icon: createCustomIcon() }
        );

        // Create popup with exact production styling
        const popupContent = `
          <div style="min-width: 220px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #FDF8F0; padding: 4px;">
            <div style="font-size: 1.2rem; font-weight: 600; color: #2C1810; margin-bottom: 8px;">
              ${supplier.name}
            </div>
            <div style="font-size: 0.9rem; color: #2C1810; margin-bottom: 4px; opacity: 0.8;">
              📍 ${supplier.location_address || 'Address not available'}
            </div>
            ${supplier.contact_phone ? `
              <div style="font-size: 0.9rem; color: #2C1810; margin-bottom: 4px; opacity: 0.8;">
                📞 <a href="tel:${supplier.contact_phone}" style="color: #D4A574; text-decoration: none; font-weight: 500;">${supplier.contact_phone}</a>
              </div>
            ` : ''}
            ${supplier.website_url ? `
              <div style="font-size: 0.9rem; color: #2C1810; margin-bottom: 8px; opacity: 0.8;">
                🌐 <a href="${supplier.website_url}" target="_blank" style="color: #D4A574; text-decoration: none; font-weight: 500;">Visit Website</a>
              </div>
            ` : ''}
            ${supplier.rating_average ? `
              <div style="font-size: 0.9rem; color: #2C1810; margin-bottom: 8px; opacity: 0.8;">
                ⭐ ${supplier.rating_average}/5 (${supplier.rating_count || 0} reviews)
              </div>
            ` : ''}
            <div style="margin-top: 8px;">
              <button 
                onclick="window.dispatchEvent(new CustomEvent('supplierClick', { detail: ${supplier.id} }))"
                style="
                  background: #D4A574; 
                  color: #FDF8F0; 
                  border: none; 
                  padding: 8px 16px; 
                  border-radius: 6px; 
                  cursor: pointer; 
                  font-size: 0.9rem; 
                  font-weight: 600;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  width: 100%;
                  margin-bottom: 4px;
                  transition: all 0.2s ease;
                "
                onmouseover="this.style.background='#B8956A'"
                onmouseout="this.style.background='#D4A574'"
              >
                View Details
              </button>
              <button 
                onclick="window.open('https://maps.google.com/?q=${encodeURIComponent(supplier.location_address)}', '_blank')"
                style="
                  background: #FDF8F0; 
                  color: #2C1810; 
                  border: 2px solid #D4A574; 
                  padding: 8px 16px; 
                  border-radius: 6px; 
                  cursor: pointer; 
                  font-size: 0.9rem; 
                  font-weight: 600;
                  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                  width: 100%;
                  transition: all 0.2s ease;
                "
                onmouseover="this.style.background='#D4A574'; this.style.color='#FDF8F0'"
                onmouseout="this.style.background='#FDF8F0'; this.style.color='#2C1810'"
              >
                Get Directions
              </button>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      }
    });

    // Fit bounds to show all suppliers
    if (markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [suppliers]);

  // Handle supplier click events
  useEffect(() => {
    const handleSupplierClick = (event) => {
      if (onSupplierClick) {
        onSupplierClick(event.detail);
      }
    };

    window.addEventListener('supplierClick', handleSupplierClick);
    return () => window.removeEventListener('supplierClick', handleSupplierClick);
  }, [onSupplierClick]);

  // Public method to trigger location finding
  const useMyLocation = () => {
    getUserLocationWithGPS();
  };

  // Expose method to parent
  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.useMyLocation = useMyLocation;
    }
  }, []);

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0.7); }
            70% { box-shadow: 0 0 0 10px rgba(255, 68, 68, 0); }
            100% { box-shadow: 0 0 0 0 rgba(255, 68, 68, 0); }
          }
          
          .custom-marker {
            background: transparent !important;
            border: none !important;
          }
          
          .user-location-marker {
            background: transparent !important;
            border: none !important;
          }
          
          .leaflet-popup-content-wrapper {
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 2px solid #E8DCC6;
          }
          
          .leaflet-popup-content {
            margin: 12px;
          }
          
          .leaflet-popup-tip {
            background: white;
            border: 2px solid #E8DCC6;
          }
        `}
      </style>
      <div 
        ref={mapRef} 
        style={{ 
          height: '100%', 
          width: '100%', 
          borderRadius: '8px',
          border: '2px solid #E8DCC6',
          background: 'white'
        }}
      />
    </>
  );
};

export default ProductionMap;