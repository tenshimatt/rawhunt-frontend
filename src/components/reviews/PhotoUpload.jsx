import React, { useState, useRef } from 'react';
import { Camera, X, Upload, Image as ImageIcon } from 'lucide-react';

/**
 * Photo Upload Component for Reviews
 * 
 * Props:
 * - photos: Array of current photos (URLs or File objects)
 * - onPhotosChange: Callback when photos change
 * - maxPhotos: Maximum number of photos allowed (default: 5)
 * - className: Additional CSS classes
 */
const PhotoUpload = ({ 
  photos = [], 
  onPhotosChange, 
  maxPhotos = 5,
  className = '' 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleFiles = (files) => {
    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      // Validate file type
      return file.type.startsWith('image/');
    });
    
    // Limit the number of photos
    const availableSlots = maxPhotos - photos.length;
    const filesToAdd = validFiles.slice(0, availableSlots);
    
    if (filesToAdd.length > 0) {
      const newPhotos = [...photos, ...filesToAdd];
      onPhotosChange?.(newPhotos);
    }
  };
  
  const handleFileSelect = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };
  
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  const removePhoto = (index) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    onPhotosChange?.(newPhotos);
  };
  
  const getPhotoUrl = (photo) => {
    if (typeof photo === 'string') {
      return photo; // Already a URL
    }
    return URL.createObjectURL(photo); // File object
  };
  
  const canAddMore = photos.length < maxPhotos;
  
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      {canAddMore && (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive 
              ? 'border-emerald-400 bg-emerald-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
              <Camera className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-emerald-600 hover:text-emerald-700 font-medium"
              >
                Click to upload
              </button>
              {' '}or drag and drop photos here
            </p>
            <p className="text-sm text-gray-500">
              PNG, JPG, JPEG up to 5MB each • {photos.length}/{maxPhotos} photos
            </p>
          </div>
        </div>
      )}
      
      {/* Photo Preview Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {photos.map((photo, index) => (
            <div key={index} className="relative group">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={getPhotoUrl(photo)}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Remove Button */}
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Upload Limit Message */}
      {!canAddMore && (
        <div className="text-center py-4 text-gray-500">
          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p>Maximum {maxPhotos} photos reached</p>
        </div>
      )}
    </div>
  );
};

export default PhotoUpload;