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

  async updateAppointmentStatus(appointmentId, newStatus, options = {}) {
    if (!appointmentId || !newStatus) {
      throw new Error('Appointment ID and status are required');
    }

    // Reuse dedicated flows where available
    if (newStatus === 'confirmed') {
      return this.approveAppointment(appointmentId, options.actorId || options.doctorId || options.userId || null);
    }
    if (newStatus === 'rejected') {
      return this.rejectAppointment(
        appointmentId,
        options.actorId || options.doctorId || options.userId || null,
        options.reason || options.rejectionReason || ''
      );
    }

    const appointmentRef = doc(db, 'appointments', appointmentId);
    const appointmentSnap = await getDoc(appointmentRef);

    if (!appointmentSnap.exists()) {
      throw new Error('Appointment not found');
    }

    const appointmentData = { id: appointmentSnap.id, ...appointmentSnap.data() };
    const updates = {
      status: newStatus,
      updatedAt: Timestamp.now()
    };

    switch (newStatus) {
      case 'completed':
        updates.completedAt = Timestamp.now();
        updates.completedBy = options.actorId || appointmentData.doctorId || null;
        break;
      case 'cancelled':
        updates.cancelledAt = Timestamp.now();
        updates.cancelledBy = options.actorId || appointmentData.patientId || null;
        if (options.reason) {
          updates.cancellationReason = options.reason;
        }
        break;
      default:
        break;
    }

    await updateDoc(appointmentRef, updates);

    try {
      const { notificationServices } = await import('./notificationServices');
      await notificationServices.sendAppointmentStatusNotification(
        appointmentData,
        newStatus,
        appointmentData.doctorName
      );
    } catch (notifError) {
      console.warn('Failed to send notification:', notifError);
    }

    return { success: true, appointmentData: { ...appointmentData, ...updates } };
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
  },

  // Update doctor profile and sync to all appointments
  async updateDoctorProfile(doctorId, updates) {
    try {
      const doctorRef = doc(db, 'users', doctorId);
      await updateDoc(doctorRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      
      // Update doctor info in all pending/future appointments
      const appointmentsQ = query(
        collection(db, 'appointments'),
        where('doctorId', '==', doctorId),
        where('status', 'in', ['pending', 'confirmed', 'approved'])
      );
      
      const appointmentsSnapshot = await getDocs(appointmentsQ);
      
      // Update each appointment with new doctor info
      const updatePromises = appointmentsSnapshot.docs.map(async (appointmentDoc) => {
        const appointmentRef = doc(db, 'appointments', appointmentDoc.id);
        return updateDoc(appointmentRef, {
          doctorName: updates.displayName || updates.name,
          doctorAvatar: updates.photoURL || updates.avatar,
          doctorPhone: updates.phone,
          doctorSpecialization: updates.specialization,
          updatedAt: Timestamp.now()
        });
      });
      
      await Promise.all(updatePromises);
      
      return { success: true, updatedAppointments: updatePromises.length };
    } catch (error) {
      console.error('Error updating doctor profile:', error);
      throw error;
    }
  },

  // Check if patient has pending/unpaid appointments
  async checkPendingAppointments(patientId) {
    try {
      const q = query(
        collection(db, 'appointments'),
        where('patientId', '==', patientId),
        where('status', 'in', ['pending', 'confirmed'])
      );
      
      const querySnapshot = await getDocs(q);
      const appointments = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Check for unpaid appointments
      const unpaidAppointments = appointments.filter(apt => 
        apt.paymentStatus !== 'paid' && apt.status === 'confirmed'
      );
      
      return {
        hasPending: appointments.length > 0,
        hasUnpaid: unpaidAppointments.length > 0,
        pendingCount: appointments.filter(apt => apt.status === 'pending').length,
        unpaidCount: unpaidAppointments.length,
        appointments: appointments
      };
    } catch (error) {
      console.error('Error checking pending appointments:', error);
      return { hasPending: false, hasUnpaid: false, pendingCount: 0, unpaidCount: 0, appointments: [] };
    }
  },

  // Update appointment payment status
  async updateAppointmentPayment(appointmentId, paymentData) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        ...paymentData,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating payment:', error);
      throw error;
    }
  },

  // Update appointment status
  async updateAppointmentStatus(appointmentId, status) {
    try {
      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        status: status,
        completedAt: status === 'completed' ? Timestamp.now() : null,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw error;
    }
  },

  // Create patient record after appointment completion
  async createPatientRecord(recordData) {
    try {
      const recordWithTimestamp = {
        ...recordData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'patientRecords'), recordWithTimestamp);
      return { id: docRef.id, ...recordWithTimestamp };
    } catch (error) {
      console.error('Error creating patient record:', error);
      throw error;
    }
  }
};

// Doctor Schedule Services
export const scheduleServices = {
  // Create or update doctor schedule
  async saveDoctorSchedule(doctorId, scheduleData) {
    try {
      const scheduleWithTimestamp = {
        ...scheduleData,
        doctorId: doctorId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      const docRef = await addDoc(collection(db, 'doctorSchedules'), scheduleWithTimestamp);
      return { id: docRef.id, ...scheduleWithTimestamp };
    } catch (error) {
      console.error('Error saving schedule:', error);
      throw error;
    }
  },

  // Get doctor schedules
  async getDoctorSchedules(doctorId) {
    try {
      const q = query(
        collection(db, 'doctorSchedules'),
        where('doctorId', '==', doctorId)
      );
      
      const querySnapshot = await getDocs(q);
      const schedules = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      // Sort by day order on client side
      const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
      return schedules.sort((a, b) => dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day));
    } catch (error) {
      console.error('Error fetching schedules:', error);
      throw error;
    }
  },

  // Update doctor schedule
  async updateDoctorSchedule(scheduleId, updates) {
    try {
      const scheduleRef = doc(db, 'doctorSchedules', scheduleId);
      await updateDoc(scheduleRef, {
        ...updates,
        updatedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating schedule:', error);
      throw error;
    }
  },

  // Delete doctor schedule
  async deleteDoctorSchedule(scheduleId) {
    try {
      const scheduleRef = doc(db, 'doctorSchedules', scheduleId);
      await updateDoc(scheduleRef, {
        isDeleted: true,
        deletedAt: Timestamp.now()
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting schedule:', error);
      throw error;
    }
  },

  // Get available time slots for a specific day
  async getAvailableTimeSlots(doctorId, date) {
    try {
      const dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date(date).getDay()];
      
      // Get doctor's schedule for this day
      const q = query(
        collection(db, 'doctorSchedules'),
        where('doctorId', '==', doctorId),
        where('day', '==', dayOfWeek),
        where('isAvailable', '==', true)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        return [];
      }
      
      const schedule = querySnapshot.docs[0].data();
      
      // Get booked appointments for this date
      const appointmentsQ = query(
        collection(db, 'appointments'),
        where('doctorId', '==', doctorId),
        where('appointmentDate', '==', date)
      );
      
      const appointmentsSnapshot = await getDocs(appointmentsQ);
      const bookedTimes = appointmentsSnapshot.docs.map(doc => doc.data().appointmentTime);
      
      // Generate available time slots
      const slots = [];
      const startTime = schedule.startTime.split(':');
      const endTime = schedule.endTime.split(':');
      const slotDuration = schedule.slotDuration;
      
      let currentHour = parseInt(startTime[0]);
      let currentMinute = parseInt(startTime[1]);
      const endHour = parseInt(endTime[0]);
      const endMinute = parseInt(endTime[1]);
      
      while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
        const timeString = `${String(currentHour).padStart(2, '0')}:${String(currentMinute).padStart(2, '0')}`;
        
        if (!bookedTimes.includes(timeString)) {
          slots.push({
            time: timeString,
            available: true
          });
        }
        
        currentMinute += slotDuration;
        if (currentMinute >= 60) {
          currentHour += Math.floor(currentMinute / 60);
          currentMinute = currentMinute % 60;
        }
      }
      
      return slots;
    } catch (error) {
      console.error('Error fetching available slots:', error);
      throw error;
    }
  }
};

// Patient Medical Records Services
export const medicalRecordServices = {
  // Get patient's medical records (for patient view)
  async getPatientMedicalRecords(patientId) {
    try {
      const recordsQuery = query(
        collection(db, 'patientRecords'),
        where('patientId', '==', patientId)
      );
      
      const snapshot = await getDocs(recordsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        visitDate: doc.data().visitDate?.toDate()
      }));
    } catch (error) {
      console.error('Error fetching patient medical records:', error);
      throw error;
    }
  },

  // Get doctor's patient records
  async getDoctorPatientRecords(doctorId) {
    try {
      const recordsQuery = query(
        collection(db, 'patientRecords'),
        where('doctorId', '==', doctorId)
      );
      
      const snapshot = await getDocs(recordsQuery);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        visitDate: doc.data().visitDate?.toDate()
      }));
    } catch (error) {
      console.error('Error fetching doctor patient records:', error);
      throw error;
    }
  }
};

// ==================== REVIEW SERVICES ====================

export const reviewServices = {
  /**
   * Create a new review for a doctor
   */
  async createReview(reviewData) {
    try {
      const reviewRef = await addDoc(collection(db, 'reviews'), {
        ...reviewData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      console.log('✅ Review created with ID:', reviewRef.id);
      
      // Update doctor stats after review submission
      await this.updateDoctorStats(reviewData.doctorId);
      
      return reviewRef.id;
    } catch (error) {
      console.error('❌ Error creating review:', error);
      throw error;
    }
  },

  /**
   * Get all reviews for a specific doctor
   */
  async getReviewsForDoctor(doctorId) {
    try {
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('doctorId', '==', doctorId),
        orderBy('createdAt', 'desc')
      );
      
      const reviewsSnapshot = await getDocs(reviewsQuery);
      
      return reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  /**
   * Calculate and update doctor statistics
   */
  async updateDoctorStats(doctorId) {
    try {
      console.log('📊 Updating doctor stats for:', doctorId);
      
      // Get all reviews for doctor
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('doctorId', '==', doctorId)
      );
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviews = reviewsSnapshot.docs.map(doc => doc.data());
      
      // Calculate average rating
      const totalRating = reviews.reduce((sum, review) => sum + (review.overallRating || 0), 0);
      const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
      
      // Calculate detailed ratings
      const avgTreatmentQuality = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + (r.treatmentQuality || 0), 0) / reviews.length 
        : 0;
      const avgCommunication = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + (r.communication || 0), 0) / reviews.length 
        : 0;
      const avgPunctuality = reviews.length > 0 
        ? reviews.reduce((sum, r) => sum + (r.punctuality || 0), 0) / reviews.length 
        : 0;
      
      // Get total completed appointments
      const appointmentsQuery = query(
        collection(db, 'appointments'),
        where('doctorId', '==', doctorId),
        where('status', '==', 'completed')
      );
      const appointmentsSnapshot = await getDocs(appointmentsQuery);
      const totalAppointments = appointmentsSnapshot.size;
      
      // Calculate if doctor is "Best Doctor" (top criteria)
      // Criteria: Average rating >= 4.5 AND total appointments >= 50
      const isBestDoctor = averageRating >= 4.5 && totalAppointments >= 50;
      
      // Update doctor document in users collection
      const doctorRef = doc(db, 'users', doctorId);
      await updateDoc(doctorRef, {
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalReviews: reviews.length,
        totalAppointments: totalAppointments,
        isBestDoctor: isBestDoctor,
        detailedRatings: {
          treatmentQuality: parseFloat(avgTreatmentQuality.toFixed(2)),
          communication: parseFloat(avgCommunication.toFixed(2)),
          punctuality: parseFloat(avgPunctuality.toFixed(2))
        },
        updatedAt: Timestamp.now()
      });
      
      console.log(`✅ Doctor stats updated for ${doctorId}:`, {
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalReviews: reviews.length,
        totalAppointments,
        isBestDoctor
      });
      
      return {
        averageRating: parseFloat(averageRating.toFixed(2)),
        totalReviews: reviews.length,
        totalAppointments,
        isBestDoctor
      };
    } catch (error) {
      console.error('❌ Error updating doctor stats:', error);
      throw error;
    }
  },

  /**
   * Check if patient can review an appointment
   */
  async canReviewAppointment(appointmentId, patientId) {
    try {
      // Check if appointment exists and is completed
      const appointmentDoc = await getDoc(doc(db, 'appointments', appointmentId));
      if (!appointmentDoc.exists()) {
        console.log('❌ Appointment not found');
        return false;
      }
      
      const appointment = appointmentDoc.data();
      
      // Must be completed appointment
      if (appointment.status !== 'completed') {
        console.log('❌ Appointment not completed yet');
        return false;
      }
      
      // Must be the patient who booked it
      if (appointment.patientId !== patientId) {
        console.log('❌ Not the patient who booked this appointment');
        return false;
      }
      
      // Check if review already exists
      const reviewQuery = query(
        collection(db, 'reviews'),
        where('appointmentId', '==', appointmentId),
        where('patientId', '==', patientId)
      );
      const reviewSnapshot = await getDocs(reviewQuery);
      
      if (!reviewSnapshot.empty) {
        console.log('❌ Review already exists for this appointment');
        return false;
      }
      
      console.log('✅ Patient can review this appointment');
      return true;
    } catch (error) {
      console.error('Error checking review eligibility:', error);
      return false;
    }
  },

  /**
   * Get review for a specific appointment
   */
  async getReviewForAppointment(appointmentId) {
    try {
      const reviewQuery = query(
        collection(db, 'reviews'),
        where('appointmentId', '==', appointmentId)
      );
      const reviewSnapshot = await getDocs(reviewQuery);
      
      if (reviewSnapshot.empty) {
        return null;
      }
      
      return {
        id: reviewSnapshot.docs[0].id,
        ...reviewSnapshot.docs[0].data()
      };
    } catch (error) {
      console.error('Error fetching appointment review:', error);
      return null;
    }
  }
};

