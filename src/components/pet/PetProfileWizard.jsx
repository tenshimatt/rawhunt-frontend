import React, { useState } from 'react';
import { Search, Check, ChevronLeft, ChevronRight } from 'lucide-react';

const PetProfileWizard = ({ onComplete, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    basicInfo: { name: '', birthDate: '', gender: '' },
    breedDetails: { breed: '', size: '', mixBreed: false },
    healthData: { weight: '', allergies: '', medications: '' },
    preferences: { activity: '', feeding: '', notes: '' }
  });

  const steps = [
    { id: 'basic', label: 'Basic Info', title: 'Tell us about your pet' },
    { id: 'breed', label: 'Breed Details', title: 'What breed is your pet?' },
    { id: 'health', label: 'Health Data', title: 'Health information' },
    { id: 'preferences', label: 'Preferences', title: 'Feeding preferences' }
  ];

  const breeds = [
    { name: 'Golden Retriever', size: 'Large' },
    { name: 'Labrador Retriever', size: 'Large' },
    { name: 'German Shepherd', size: 'Large' },
    { name: 'Bulldog', size: 'Medium' },
    { name: 'Beagle', size: 'Medium' },
    { name: 'Poodle', size: 'Medium' },
    { name: 'Yorkshire Terrier', size: 'Small' },
    { name: 'Chihuahua', size: 'Small' },
    { name: 'Boston Terrier', size: 'Small' },
    { name: 'Mixed Breed', size: 'Varies' }
  ];

  const [breedSearch, setBreedSearch] = useState('');
  const [showBreedDropdown, setShowBreedDropdown] = useState(false);
  const [filteredBreeds, setFilteredBreeds] = useState(breeds);

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: { ...prev[section], ...data }
    }));
  };

  const handleBreedSearch = (value) => {
    setBreedSearch(value);
    const filtered = breeds.filter(breed => 
      breed.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredBreeds(filtered);
    setShowBreedDropdown(value.length > 0);
  };

  const selectBreed = (breed) => {
    updateFormData('breedDetails', { breed: breed.name, size: breed.size });
    setBreedSearch(breed.name);
    setShowBreedDropdown(false);
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete(formData);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const ProgressStepper = () => (
    <div className="w-full h-[60px] bg-[#FAFAFA] border-b border-[#EEEEEE] flex items-center justify-center px-4">
      <div className="flex items-center justify-between w-full max-w-md">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative">
            {/* Connecting line */}
            {index < steps.length - 1 && (
              <div 
                className={`absolute top-4 left-8 h-0.5 transition-colors duration-300 ${
                  index < currentStep ? 'bg-[#FF6B35]' : 'bg-[#E0E0E0]'
                }`}
                style={{ width: 'calc(100vw / 4 - 32px)', maxWidth: '80px' }}
              />
            )}
            
            {/* Step circle */}
            <div 
              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                index === currentStep 
                  ? 'bg-white border-[#FF6B35] text-[#FF6B35]' 
                  : index < currentStep 
                    ? 'bg-[#FF6B35] border-[#FF6B35] text-white'
                    : 'bg-[#F5F5F5] border-[#E0E0E0] text-[#9E9E9E]'
              }`}
            >
              {index < currentStep ? (
                <Check size={16} className="text-white" />
              ) : (
                <span className="font-inter font-semibold text-sm">{index + 1}</span>
              )}
            </div>
            
            {/* Step label */}
            <span 
              className={`mt-1 font-inter font-medium text-xs leading-4 transition-colors duration-300 ${
                index === currentStep 
                  ? 'text-[#212121]' 
                  : index < currentStep 
                    ? 'text-[#757575]'
                    : 'text-[#BDBDBD]'
              }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const BasicInfoStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Pet Name
        </label>
        <input
          type="text"
          value={formData.basicInfo.name}
          onChange={(e) => updateFormData('basicInfo', { name: e.target.value })}
          className="w-full h-12 px-4 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121]"
          placeholder="Enter your pet's name"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Birth Date
        </label>
        <input
          type="date"
          value={formData.basicInfo.birthDate}
          onChange={(e) => updateFormData('basicInfo', { birthDate: e.target.value })}
          className="w-full h-12 px-4 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121]"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Gender
        </label>
        <select
          value={formData.basicInfo.gender}
          onChange={(e) => updateFormData('basicInfo', { gender: e.target.value })}
          className="w-full h-12 px-4 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121]"
        >
          <option value="">Select gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
        </select>
      </div>
    </div>
  );

  const BreedDetailsStep = () => (
    <div className="space-y-6">
      <div className="relative">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Breed
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search size={16} className="text-[#BDBDBD]" />
          </div>
          <input
            type="text"
            value={breedSearch}
            onChange={(e) => handleBreedSearch(e.target.value)}
            onFocus={() => breedSearch && setShowBreedDropdown(true)}
            className="w-full h-12 pl-12 pr-4 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121]"
            placeholder="Search for breed..."
          />
          
          {showBreedDropdown && (
            <div className="absolute top-full left-0 right-0 z-50 bg-white border border-[#E0E0E0] rounded-lg shadow-lg max-h-60 overflow-auto mt-1">
              <div className="scrollbar-thin scrollbar-track-[#E0E0E0] scrollbar-thumb-[#BDBDBD]">
                {filteredBreeds.map((breed) => (
                  <div
                    key={breed.name}
                    onClick={() => selectBreed(breed)}
                    className="h-10 px-4 flex items-center justify-between cursor-pointer hover:bg-[#FAFAFA] transition-colors"
                  >
                    <span className="font-inter font-medium text-base text-[#212121]">
                      {breed.name}
                    </span>
                    <span className="font-inter text-sm text-[#757575]">
                      {breed.size}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center">
        <input
          type="checkbox"
          id="mixBreed"
          checked={formData.breedDetails.mixBreed}
          onChange={(e) => updateFormData('breedDetails', { mixBreed: e.target.checked })}
          className="h-4 w-4 text-[#FF6B35] focus:ring-[#FF6B35] border-[#E0E0E0] rounded"
        />
        <label htmlFor="mixBreed" className="ml-2 text-sm text-gray-700">
          This is a mixed breed
        </label>
      </div>
    </div>
  );

  const HealthDataStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Weight (lbs)
        </label>
        <input
          type="number"
          value={formData.healthData.weight}
          onChange={(e) => updateFormData('healthData', { weight: e.target.value })}
          className="w-full h-12 px-4 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121]"
          placeholder="Enter weight"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Known Allergies
        </label>
        <textarea
          value={formData.healthData.allergies}
          onChange={(e) => updateFormData('healthData', { allergies: e.target.value })}
          className="w-full h-24 px-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121] resize-none"
          placeholder="List any known allergies..."
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Medications
        </label>
        <textarea
          value={formData.healthData.medications}
          onChange={(e) => updateFormData('healthData', { medications: e.target.value })}
          className="w-full h-24 px-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121] resize-none"
          placeholder="List current medications..."
        />
      </div>
    </div>
  );

  const PreferencesStep = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Activity Level
        </label>
        <select
          value={formData.preferences.activity}
          onChange={(e) => updateFormData('preferences', { activity: e.target.value })}
          className="w-full h-12 px-4 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121]"
        >
          <option value="">Select activity level</option>
          <option value="low">Low - Mostly indoor, minimal exercise</option>
          <option value="moderate">Moderate - Regular walks, some play</option>
          <option value="high">High - Active dog, lots of exercise</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Current Feeding Schedule
        </label>
        <select
          value={formData.preferences.feeding}
          onChange={(e) => updateFormData('preferences', { feeding: e.target.value })}
          className="w-full h-12 px-4 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121]"
        >
          <option value="">Select feeding schedule</option>
          <option value="once">Once per day</option>
          <option value="twice">Twice per day</option>
          <option value="multiple">Multiple small meals</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Additional Notes
        </label>
        <textarea
          value={formData.preferences.notes}
          onChange={(e) => updateFormData('preferences', { notes: e.target.value })}
          className="w-full h-24 px-4 py-3 border border-[#E0E0E0] rounded-lg focus:ring-2 focus:ring-[#FF6B35] focus:border-[#FF6B35] transition-colors font-inter text-base text-[#212121] resize-none"
          placeholder="Any special notes about your pet..."
        />
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return <BasicInfoStep />;
      case 1: return <BreedDetailsStep />;
      case 2: return <HealthDataStep />;
      case 3: return <PreferencesStep />;
      default: return <BasicInfoStep />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <ProgressStepper />
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="font-poppins font-bold text-2xl leading-8 text-[#212121] mb-4">
              {steps[currentStep].title}
            </h1>
            <p className="font-inter text-base leading-6 text-[#757575]">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>

          {/* Form Content */}
          <div className="mb-8">
            {renderCurrentStep()}
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={currentStep === 0 ? onCancel : prevStep}
              className="flex items-center px-6 py-3 border border-[#E0E0E0] rounded-lg text-[#757575] hover:bg-[#FAFAFA] transition-colors font-inter font-medium"
            >
              <ChevronLeft size={16} className="mr-2" />
              {currentStep === 0 ? 'Cancel' : 'Previous'}
            </button>
            
            <button
              onClick={nextStep}
              className="flex items-center px-6 py-3 bg-gradient-to-r from-[#FF6B35] to-[#E55A2E] text-white rounded-lg hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150 font-inter font-semibold"
            >
              {currentStep === steps.length - 1 ? 'Complete' : 'Next'}
              {currentStep !== steps.length - 1 && <ChevronRight size={16} className="ml-2" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PetProfileWizard;