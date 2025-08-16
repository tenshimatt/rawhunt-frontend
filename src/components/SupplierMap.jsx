import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issue with React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const SupplierMap = ({ suppliers = [], userLocation = null, onSupplierClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  // Create custom icon for suppliers (exact same as production)
  const createCustomIcon = () => {
    return L.divIcon({
      html: '<div style="background: #D4A574; width: 36px; height: 36px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 18px;">🦴</div>',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18],
      className: 'custom-marker'
    });
  };

  // Create user location icon (exact same as production)
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

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map with same view as production
    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4);
    
    // Use same tile layer as production
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      attribution: '© OpenStreetMap contributors © CARTO',
      subdomains: 'abcd',
      maxZoom: 20
    }).addTo(map);

    mapInstanceRef.current = map;

    // Try to get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 10);
          
          // Add user location marker
          if (userMarkerRef.current) {
            userMarkerRef.current.remove();
          }
          userMarkerRef.current = L.marker([latitude, longitude], {
            icon: createUserIcon(true)
          }).addTo(map);
        },
        (error) => {
          console.log('Could not get precise location, using IP-based location');
        }
      );
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when suppliers change
  useEffect(() => {
    if (!mapInstanceRef.current) return;

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

        // Create popup content
        const popupContent = `
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">
              ${supplier.name}
            </h3>
            <p style="margin: 4px 0; color: #666; font-size: 14px;">
              ${supplier.location_address || 'Address not available'}
            </p>
            ${supplier.contact_phone ? `
              <p style="margin: 4px 0; color: #666; font-size: 14px;">
                📞 ${supplier.contact_phone}
              </p>
            ` : ''}
            ${supplier.rating_average ? `
              <p style="margin: 4px 0; color: #666; font-size: 14px;">
                ⭐ ${supplier.rating_average} / 5
              </p>
            ` : ''}
            <button 
              onclick="window.dispatchEvent(new CustomEvent('supplierClick', { detail: ${supplier.id} }))"
              style="margin-top: 8px; padding: 6px 12px; background: #D4A574; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; width: 100%;"
            >
              View Details
            </button>
          </div>
        `;

        marker.bindPopup(popupContent);
        marker.addTo(mapInstanceRef.current);
        markersRef.current.push(marker);
      }
    });

    // Fit bounds to show all markers if we have suppliers
    if (suppliers.length > 0 && markersRef.current.length > 0) {
      const group = L.featureGroup(markersRef.current);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }
  }, [suppliers]);

  // Handle supplier click from popup
  useEffect(() => {
    const handleSupplierClick = (event) => {
      if (onSupplierClick) {
        onSupplierClick(event.detail);
      }
    };

    window.addEventListener('supplierClick', handleSupplierClick);
    return () => window.removeEventListener('supplierClick', handleSupplierClick);
  }, [onSupplierClick]);

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
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          }
          
          .leaflet-popup-content {
            margin: 12px;
          }
        `}
      </style>
      <div 
        ref={mapRef} 
        style={{ 
          height: '100%', 
          width: '100%', 
          borderRadius: '8px',
          border: '2px solid #E8DCC6'
        }}
      />
    </>
  );
};

export default SupplierMap;