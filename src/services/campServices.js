import { db } from '@/firebase/config';
import { 
  collection, 
  addDoc, 
  getDocs, 
  getDoc,
  doc,
  query, 
  where, 
  orderBy, 
  updateDoc,
  arrayUnion,
  arrayRemove,
  Timestamp,
  GeoPoint
} from 'firebase/firestore';

const CAMPS_COLLECTION = 'health_camps';

/**
 * Create a new health camp
 */
export const createCamp = async (campData) => {
  try {
    const campRef = await addDoc(collection(db, CAMPS_COLLECTION), {
      ...campData,
      registered: 0,
      registeredPatients: [],
      status: 'upcoming',
      createdAt: Timestamp.now()
    });
    return { id: campRef.id, success: true };
  } catch (error) {
    console.error('Error creating camp:', error);
    throw error;
  }
};

/**
 * Get camps by location (within radius)
 */
export const getCampsByLocation = async (userLat, userLng, radiusKm = 50) => {
  try {
    const campsRef = collection(db, CAMPS_COLLECTION);
    const q = query(
      campsRef,
      where('status', 'in', ['upcoming', 'ongoing']),
      orderBy('date', 'asc')
    );
    
    const snapshot = await getDocs(q);
    const camps = [];
    
    snapshot.forEach((doc) => {
      const camp = { id: doc.id, ...doc.data() };
      
      // Calculate distance from user location
      if (camp.location && camp.location.coordinates) {
        const campLat = camp.location.coordinates.lat;
        const campLng = camp.location.coordinates.lng;
        const distance = calculateDistance(userLat, userLng, campLat, campLng);
        
        if (distance <= radiusKm) {
          camp.distance = distance.toFixed(1);
          camps.push(camp);
        }
      }
    });
    
    // Sort by distance
    camps.sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
    
    return camps;
  } catch (error) {
    console.error('Error fetching camps by location:', error);
    throw error;
  }
};

/**
 * Get all camps (for admin/doctor view)
 */
export const getAllCamps = async (filters = {}) => {
  try {
    const campsRef = collection(db, CAMPS_COLLECTION);
    let q = query(campsRef, orderBy('date', 'desc'));
    
    // Apply filters
    if (filters.organizerId) {
      q = query(campsRef, where('organizerId', '==', filters.organizerId), orderBy('date', 'desc'));
    }
    if (filters.type) {
      q = query(campsRef, where('type', '==', filters.type), orderBy('date', 'desc'));
    }
    if (filters.status) {
      q = query(campsRef, where('status', '==', filters.status), orderBy('date', 'desc'));
    }
    
    const snapshot = await getDocs(q);
    const camps = [];
    
    snapshot.forEach((doc) => {
      camps.push({ id: doc.id, ...doc.data() });
    });
    
    return camps;
  } catch (error) {
    console.error('Error fetching camps:', error);
    throw error;
  }
};

/**
 * Get camp by ID
 */
export const getCampById = async (campId) => {
  try {
    const campDoc = await getDoc(doc(db, CAMPS_COLLECTION, campId));
    if (campDoc.exists()) {
      return { id: campDoc.id, ...campDoc.data() };
    }
    return null;
  } catch (error) {
    console.error('Error fetching camp:', error);
    throw error;
  }
};

/**
 * Register patient for camp
 */
export const registerForCamp = async (campId, patientId, patientName) => {
  try {
    const campRef = doc(db, CAMPS_COLLECTION, campId);
    const campDoc = await getDoc(campRef);
    
    if (!campDoc.exists()) {
      throw new Error('Camp not found');
    }
    
    const campData = campDoc.data();
    
    // Check if already registered
    if (campData.registeredPatients?.includes(patientId)) {
      throw new Error('Already registered for this camp');
    }
    
    // Check capacity
    if (campData.registered >= campData.capacity) {
      throw new Error('Camp is full');
    }
    
    // Register patient
    await updateDoc(campRef, {
      registeredPatients: arrayUnion(patientId),
      registered: (campData.registered || 0) + 1
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error registering for camp:', error);
    throw error;
  }
};

/**
 * Unregister patient from camp
 */
export const unregisterFromCamp = async (campId, patientId) => {
  try {
    const campRef = doc(db, CAMPS_COLLECTION, campId);
    const campDoc = await getDoc(campRef);
    
    if (!campDoc.exists()) {
      throw new Error('Camp not found');
    }
    
    const campData = campDoc.data();
    
    // Check if registered
    if (!campData.registeredPatients?.includes(patientId)) {
      throw new Error('Not registered for this camp');
    }
    
    // Unregister patient
    await updateDoc(campRef, {
      registeredPatients: arrayRemove(patientId),
      registered: Math.max(0, (campData.registered || 0) - 1)
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error unregistering from camp:', error);
    throw error;
  }
};

/**
 * Update camp status
 */
export const updateCampStatus = async (campId, status) => {
  try {
    const campRef = doc(db, CAMPS_COLLECTION, campId);
    await updateDoc(campRef, { status });
    return { success: true };
  } catch (error) {
    console.error('Error updating camp status:', error);
    throw error;
  }
};

/**
 * Calculate distance between two coordinates (Haversine formula)
 */
const calculateDistance = (lat1, lon1, lat2, lon2) => {
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

export default {
  createCamp,
  getCampsByLocation,
  getAllCamps,
  getCampById,
  registerForCamp,
  unregisterFromCamp,
  updateCampStatus
};
