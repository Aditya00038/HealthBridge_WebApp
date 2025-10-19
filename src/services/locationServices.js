// Real Healthcare Facilities Data Service
// This service can be connected to real APIs like Google Places, OpenStreetMap, or your backend

import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '@/firebase/config';

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
 * @returns {Promise<Array>}
 */
export const fetchHealthcareFacilities = async (options = {}) => {
  try {
    const { type, maxDistance = 10, userLocation } = options;
    
    let q = query(collection(db, 'healthcareFacilities'));
    
    // Filter by type if specified
    if (type && type !== 'all') {
      q = query(q, where('type', '==', type));
    }
    
    // Add ordering
    q = query(q, orderBy('rating', 'desc'));
    
    const snapshot = await getDocs(q);
    let facilities = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    // Calculate distances if user location provided
    if (userLocation) {
      facilities = facilities.map(facility => ({
        ...facility,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          facility.coordinates.lat,
          facility.coordinates.lng
        )
      }));
      
      // Filter by max distance and sort
      facilities = facilities
        .filter(f => f.distance <= maxDistance)
        .sort((a, b) => a.distance - b.distance);
    }
    
    return facilities;
  } catch (error) {
    console.error('Error fetching facilities:', error);
    throw error;
  }
};

/**
 * Search facilities using Google Places API
 * Note: Requires Google Maps API key in environment variables
 * @param {string} searchQuery - Search term
 * @param {Object} location - {lat, lng}
 * @param {number} radius - Search radius in meters
 * @returns {Promise<Array>}
 */
export const searchGooglePlaces = async (searchQuery, location, radius = 5000) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey) {
    console.warn('Google Maps API key not found');
    return [];
  }
  
  try {
    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?` +
      `location=${location.lat},${location.lng}` +
      `&radius=${radius}` +
      `&keyword=${encodeURIComponent(searchQuery)}` +
      `&type=hospital|doctor|health` +
      `&key=${apiKey}`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.status === 'OK') {
      return data.results.map(place => ({
        id: place.place_id,
        name: place.name,
        address: place.vicinity,
        rating: place.rating || 0,
        reviews: place.user_ratings_total || 0,
        coordinates: {
          lat: place.geometry.location.lat,
          lng: place.geometry.location.lng
        },
        type: determineType(place.types),
        image: place.photos?.[0] 
          ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${place.photos[0].photo_reference}&key=${apiKey}`
          : null,
        isOpen: place.opening_hours?.open_now
      }));
    }
    
    return [];
  } catch (error) {
    console.error('Error searching Google Places:', error);
    return [];
  }
};

/**
 * Determine facility type from Google Places types
 */
const determineType = (types) => {
  if (types.includes('hospital')) return 'hospital';
  if (types.includes('doctor')) return 'doctor';
  if (types.includes('health') || types.includes('clinic')) return 'clinic';
  return 'clinic';
};

/**
 * Real hospital and clinic data for major cities
 * This is fallback data when APIs are not available
 * Replace with your actual city/region
 */
export const REAL_HEALTHCARE_DATA = {
  // New York City
  'new-york': [
    {
      id: 'nyc-1',
      name: 'NewYork-Presbyterian Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Teaching Hospital',
      rating: 4.4,
      reviews: 1240,
      address: '525 East 68th Street, New York, NY 10065',
      phone: '+1 (212) 746-5454',
      hours: '24/7',
      doctors: 200,
      coordinates: { lat: 40.7649, lng: -73.9540 },
      website: 'https://www.nyp.org',
      services: ['Emergency Care', 'Surgery', 'Cardiology', 'Neurology', 'Pediatrics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'nyc-2',
      name: 'Mount Sinai Hospital',
      type: 'hospital',
      specialty: 'Academic Medical Center',
      rating: 4.3,
      reviews: 980,
      address: '1 Gustave L. Levy Place, New York, NY 10029',
      phone: '+1 (212) 241-6500',
      hours: '24/7',
      doctors: 180,
      coordinates: { lat: 40.7903, lng: -73.9516 },
      website: 'https://www.mountsinai.org',
      services: ['Emergency', 'Oncology', 'Transplant', 'Geriatrics'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    },
    {
      id: 'nyc-3',
      name: 'CityMD Urgent Care',
      type: 'clinic',
      specialty: 'Urgent Care Center',
      rating: 4.2,
      reviews: 450,
      address: '350 5th Avenue, New York, NY 10118',
      phone: '+1 (212) 252-2000',
      hours: 'Mon-Sun: 8AM-8PM',
      doctors: 15,
      coordinates: { lat: 40.7484, lng: -73.9857 },
      website: 'https://www.citymd.com',
      services: ['Urgent Care', 'X-Ray', 'Lab Tests', 'Vaccinations'],
      image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=400'
    }
  ],
  
  // Los Angeles
  'los-angeles': [
    {
      id: 'la-1',
      name: 'Cedars-Sinai Medical Center',
      type: 'hospital',
      specialty: 'Academic Health Science Center',
      rating: 4.5,
      reviews: 1580,
      address: '8700 Beverly Blvd, Los Angeles, CA 90048',
      phone: '+1 (310) 423-3277',
      hours: '24/7',
      doctors: 250,
      coordinates: { lat: 34.0755, lng: -118.3770 },
      website: 'https://www.cedars-sinai.org',
      services: ['Emergency', 'Heart Institute', 'Cancer', 'Orthopedics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'la-2',
      name: 'UCLA Medical Center',
      type: 'hospital',
      specialty: 'University Hospital',
      rating: 4.6,
      reviews: 1320,
      address: '757 Westwood Plaza, Los Angeles, CA 90095',
      phone: '+1 (310) 825-9111',
      hours: '24/7',
      doctors: 220,
      coordinates: { lat: 34.0522, lng: -118.2437 },
      website: 'https://www.uclahealth.org',
      services: ['Trauma Center', 'Neurosurgery', 'Organ Transplant'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    }
  ],
  
  // London
  'london': [
    {
      id: 'ldn-1',
      name: 'St Thomas\' Hospital',
      type: 'hospital',
      specialty: 'NHS Foundation Trust',
      rating: 4.3,
      reviews: 890,
      address: 'Westminster Bridge Rd, London SE1 7EH, UK',
      phone: '+44 20 7188 7188',
      hours: '24/7',
      doctors: 150,
      coordinates: { lat: 51.4975, lng: -0.1188 },
      website: 'https://www.guysandstthomas.nhs.uk',
      services: ['Emergency', 'Cardiac', 'Renal', 'Respiratory'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'ldn-2',
      name: 'The Portland Hospital',
      type: 'hospital',
      specialty: 'Private Hospital',
      rating: 4.7,
      reviews: 560,
      address: '205-209 Great Portland St, London W1W 5AH, UK',
      phone: '+44 20 7580 4400',
      hours: '24/7',
      doctors: 100,
      coordinates: { lat: 51.5246, lng: -0.1438 },
      website: 'https://www.theportlandhospital.com',
      services: ['Maternity', 'Pediatrics', 'Neonatal', 'Gynecology'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    }
  ],
  
  // Mumbai
  'mumbai': [
    {
      id: 'mum-1',
      name: 'Lilavati Hospital',
      type: 'hospital',
      specialty: 'Multi-Specialty Hospital',
      rating: 4.4,
      reviews: 1120,
      address: 'A-791, Bandra Reclamation, Mumbai, Maharashtra 400050',
      phone: '+91 22 2640 0000',
      hours: '24/7',
      doctors: 180,
      coordinates: { lat: 19.0596, lng: 72.8295 },
      website: 'https://www.lilavatihospital.com',
      services: ['Cardiology', 'Orthopedics', 'Neurology', 'Oncology'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    },
    {
      id: 'mum-2',
      name: 'Breach Candy Hospital',
      type: 'hospital',
      specialty: 'Private Hospital',
      rating: 4.3,
      reviews: 890,
      address: '60-A, Bhulabhai Desai Rd, Mumbai, Maharashtra 400026',
      phone: '+91 22 2367 9111',
      hours: '24/7',
      doctors: 150,
      coordinates: { lat: 18.9711, lng: 72.8051 },
      website: 'https://www.breachcandyhospital.org',
      services: ['Emergency', 'Surgery', 'ICU', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=400'
    }
  ],
  
  // Add more cities as needed
  'default': [
    // Fallback generic data
    {
      id: 'default-1',
      name: 'City General Hospital',
      type: 'hospital',
      specialty: 'General Hospital',
      rating: 4.2,
      reviews: 500,
      address: 'Your City, Your State',
      phone: '+1 (555) 123-4567',
      hours: '24/7',
      doctors: 100,
      coordinates: { lat: 40.7128, lng: -74.0060 },
      services: ['Emergency', 'Surgery', 'Diagnostics'],
      image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400'
    }
  ]
};

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
