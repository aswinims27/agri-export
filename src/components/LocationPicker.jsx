import React, { useState, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';

const LocationPicker = ({ value, onChange, error }) => {
  const [searchTerm, setSearchTerm] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Indian states and major cities for suggestions
  const locations = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
    'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
    'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
    'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
    'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai',
    'Kolkata', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
    'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane',
    'Bhopal', 'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara'
  ];

  useEffect(() => {
    if (searchTerm.length > 1) {
      const filtered = locations.filter(location =>
        location.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered.slice(0, 5));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchTerm]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onChange(value);
  };

  const handleSuggestionClick = (location) => {
    setSearchTerm(location);
    onChange(location);
    setShowSuggestions(false);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            // In a real app, you'd use a geocoding service like Google Maps API
            // For demo purposes, we'll just set a placeholder
            const location = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
            setSearchTerm(location);
            onChange(location);
          } catch (error) {
            console.error('Error getting location name:', error);
          }
        },
        (error) => {
          console.error('Error getting current location:', error);
          alert('Unable to get current location. Please enter manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        Farm Location
      </label>
      <div className="relative">
        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => searchTerm.length > 1 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
          placeholder="Enter your farm location"
        />
        <button
          type="button"
          onClick={getCurrentLocation}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-700"
          title="Use current location"
        >
          <Search className="h-5 w-5" />
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((location, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSuggestionClick(location)}
              className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-400" />
                <span>{location}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
        Click the search icon to use your current location
      </p>
    </div>
  );
};

export default LocationPicker;