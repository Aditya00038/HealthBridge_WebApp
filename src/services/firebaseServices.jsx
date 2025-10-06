import { collection, doc, addDoc, getDoc, getDocs, query, where, orderBy, setDoc, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const appointmentServices = {
  async createAppointment(appointmentData) {
    try {
      const appointmentWithTimestamp = {
        ...appointmentData,
        status: 'pending',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'appointments'), appointmentWithTimestamp);
      const newAppointment = { id: docRef.id, ...appointmentWithTimestamp };
      
      // Send notification to doctor about new appointment request
      try {
        const { notificationServices } = await import('./notificationServices');
        await notificationServices.sendNewAppointmentNotification(newAppointment);
      } catch (notifError) {
        console.warn('Failed to send notification:', notifError);
      }
      
      return newAppointment;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },
  
  async approveAppointment(appointmentId, doctorId) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      
      // Get appointment data before updating
      const appointmentDoc = await getDoc(appointmentRef);
      if (!appointmentDoc.exists()) {
        throw new Error('Appointment not found');
      }
      
      const appointmentData = { id: appointmentDoc.id, ...appointmentDoc.data() };
      
      // Update appointment status
      await updateDoc(appointmentRef, {
        status: 'confirmed',
        confirmedAt: Timestamp.now(),
        confirmedBy: doctorId,
        updatedAt: Timestamp.now()
      });
      
      // Send notification to patient
      try {
        const { notificationServices } = await import('./notificationServices');
        await notificationServices.sendAppointmentStatusNotification(
          appointmentData, 
          'confirmed', 
          appointmentData.doctorName
        );
      } catch (notifError) {
        console.warn('Failed to send notification:', notifError);
      }
      
      return { success: true, appointmentData };
    } catch (error) {
      throw error;
    }
  },
  
  async rejectAppointment(appointmentId, doctorId, rejectionReason = '') {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      
      // Get appointment data before updating
      const appointmentDoc = await getDoc(appointmentRef);
      if (!appointmentDoc.exists()) {
        throw new Error('Appointment not found');
      }
      
      const appointmentData = { id: appointmentDoc.id, ...appointmentDoc.data() };
      
      // Update appointment status
      await updateDoc(appointmentRef, {
        status: 'rejected',
        rejectedAt: Timestamp.now(),
        rejectedBy: doctorId,
        rejectionReason: rejectionReason,
        updatedAt: Timestamp.now()
      });
      
      // Send notification to patient
      try {
        const { notificationServices } = await import('./notificationServices');
        await notificationServices.sendAppointmentStatusNotification(
          appointmentData, 
          'rejected', 
          appointmentData.doctorName
        );
      } catch (notifError) {
        console.warn('Failed to send notification:', notifError);
      }
      
      return { success: true, appointmentData };
    } catch (error) {
      throw error;
    }
  },
  
  async getPendingAppointments(doctorId) {
    try {
      console.log('Querying pending appointments for doctorId:', doctorId);
      const q = query(
        collection(db, 'appointments'),
        where('doctorId', '==', doctorId),
        where('status', '==', 'pending')
      );
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in memory instead of using orderBy
      results.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      console.log('Query results:', results);
      return results;
    } catch (error) {
      console.error('Error in getPendingAppointments:', error);
      return [];
    }
  },

  async getUserAppointments(userId, userRole = 'patient') {
    try {
      let q;
      if (userRole === 'doctor') {
        q = query(
          collection(db, 'appointments'),
          where('doctorId', '==', userId)
        );
      } else {
        q = query(
          collection(db, 'appointments'),
          where('patientId', '==', userId)
        );
      }
      const querySnapshot = await getDocs(q);
      const results = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      // Sort in memory instead of using orderBy
      results.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      return results;
    } catch (error) {
      console.error('Error fetching user appointments:', error);
      return [];
    }
  },

  async getAppointmentById(appointmentId) {
    try {
      const docRef = doc(db, 'appointments', appointmentId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error fetching appointment:', error);
      return null;
    }
  }
};

export const doctorServices = {
  async getAllDoctors(showOnlyApproved = true) {
    try {
      let q;
      if (showOnlyApproved) {
        q = query(
          collection(db, 'users'),
          where('role', '==', 'doctor'),
          where('profileStatus', '==', 'approved')
        );
      } else {
        q = query(collection(db, 'users'), where('role', '==', 'doctor'));
      }
      const querySnapshot = await getDocs(q);
      const doctors = querySnapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
        name: doc.data().displayName || doc.data().name || 'Dr. ' + doc.data().email?.split('@')[0],
        available: doc.data().available !== false,
        rating: doc.data().rating || 4.5
      }));
      return doctors;
    } catch (error) {
      return [];
    }
  },
  
  async createDoctorProfile(userId, doctorData) {
    try {
      const docRef = doc(db, 'users', userId);
      const existingDoc = await getDoc(docRef);
      const existingData = existingDoc.exists() ? existingDoc.data() : {};
      
      const doctorProfile = {
        ...existingData,
        ...doctorData,
        role: 'doctor',
        profileStatus: 'approved',
        isApproved: true,
        available: true,
        rating: 4.5
      };

      await setDoc(docRef, doctorProfile, { merge: true });
      return doctorProfile;
    } catch (error) {
      throw error;
    }
  }
};
