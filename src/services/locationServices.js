// Real Healthcare Facilities Data Service
// This service can be connected to real APIs like Google Places, OpenStreetMap, or your backend

import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { INDIAN_HEALTHCARE_DATA } from './indianHealthcareData';

/**
 * Calculate distance between two coordinates (Haversine formula)
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lon1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lon2 - Longitude of point 2
 * @returns {number} Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

/**
 * Get user's current location
 * @returns {Promise<{lat: number, lng: number}>}
 */
export const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by your browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

/**
 * Fetch healthcare facilities from Firestore
 * @param {Object} options - Query options
 * @param {string} options.type - Type of facility (hospital, clinic, doctor)
 * @param {Object} options.location - User location { lat, lng }
 * @param {number} options.maxDistance - Maximum distance in km
 * @returns {Promise<Array>}
 */
export const fetchHealthcareFacilities = async (options = {}) => {
  try {
    const { type, location, maxDistance = 50 } = options;
    
    // Build Firestore query
    let q = collection(db, 'healthcare_facilities');
    
    if (type && type !== 'all') {
      q = query(q, where('type', '==', type));
    }
    
    // Execute query
    const querySnapshot = await getDocs(q);
    const facilities = [];
    
    querySnapshot.forEach((doc) => {
      const facility = { id: doc.id, ...doc.data() };
      
      // Calculate distance if location provided
      if (location && facility.coordinates) {
        facility.distance = calculateDistance(
          location.lat,
          location.lng,
          facility.coordinates.lat,
          facility.coordinates.lng
        );
        
        // Filter by max distance
        if (facility.distance <= maxDistance) {
          facilities.push(facility);
        }
      } else {
        facilities.push(facility);
      }
    });
    
    // Sort by distance if available
    if (location) {
      facilities.sort((a, b) => (a.distance || 0) - (b.distance || 0));
    }
    
    return facilities;
  } catch (error) {
    console.error('Error fetching healthcare facilities:', error);
    throw error;
  }
};

/**
 * Search Google Places API for healthcare facilities
 * This requires VITE_GOOGLE_MAPS_API_KEY environment variable
 * @param {string} query - Search query
 * @param {Object} location - Search location { lat, lng }
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>}
 */
export const searchGooglePlaces = async (query, location, radius = 5000, category = null) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.warn('Google Maps API key not configured');
    return [];
  }

  try {
    // Use a generic establishment type and rely on keyword to find camps/events
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location.lat},${location.lng}&radius=${radius}&type=establishment&keyword=${encodeURIComponent(query)}&key=${apiKey}`;

    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK') {
      return data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        // If caller provided a category (e.g. 'blood_donation'), use that as the type so UI can group.
        type: category || getTypeFromPlaceTypes(place.types),
        address: place.vicinity,
        rating: place.rating || 0,
        reviews: place.user_ratings_total || 0,
        coordinates: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        photo: place.photos?.[0]?.photo_reference
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
          : null,
        isOpen: place.opening_hours?.open_now,
        rawTypes: place.types || []
      }));
    }

    return [];
  } catch (error) {
    console.error('Error searching Google Places:', error);
    return [];
  }
};

// Helper function to map Google Places types to our types
const getTypeFromPlaceTypes = (types) => {
  if (types.includes('hospital')) return 'hospital';
  if (types.includes('doctor')) return 'doctor';
  if (types.includes('health') || types.includes('clinic')) return 'clinic';
  return 'clinic';
};

/**
 * Real hospital and clinic data for major Indian cities
 * Comprehensive data for healthcare facilities across India
 */
export const REAL_HEALTHCARE_DATA = INDIAN_HEALTHCARE_DATA;

/**
 * Get facilities by city
 * @param {string} city - City name (lowercase with hyphens)
 * @returns {Array}
 */
export const getFacilitiesByCity = (city) => {
  return REAL_HEALTHCARE_DATA[city] || REAL_HEALTHCARE_DATA['default'];
};

/**
 * Get all available cities
 * @returns {Array<string>}
 */
export const getAvailableCities = () => {
  return Object.keys(REAL_HEALTHCARE_DATA).filter(key => key !== 'default');
};
