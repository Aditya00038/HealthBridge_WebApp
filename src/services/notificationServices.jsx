import { collection, addDoc, query, where, getDocs, orderBy, updateDoc, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export const notificationServices = {
  // Create a notification
  async createNotification(notificationData) {
    try {
      const docRef = await addDoc(collection(db, 'notifications'), {
        ...notificationData,
        createdAt: Timestamp.now(),
        read: false
      });
      return { id: docRef.id, ...notificationData };
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get notifications for a user
  async getUserNotifications(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId)
      );
      const querySnapshot = await getDocs(q);
      const notifications = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      // Sort by createdAt in memory
      notifications.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0);
        const bTime = b.createdAt?.toDate?.() || new Date(0);
        return bTime - aTime;
      });
      
      return notifications;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }
  },

  // Mark all notifications as read
  async markAllAsRead(userId) {
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        where('read', '==', false)
      );
      const querySnapshot = await getDocs(q);
      
      const updatePromises = querySnapshot.docs.map(docRef => 
        updateDoc(docRef.ref, { read: true, readAt: Timestamp.now() })
      );
      
      await Promise.all(updatePromises);
      return { success: true, updatedCount: querySnapshot.docs.length };
    } catch (error) {
      console.error('Error marking notifications as read:', error);
      throw error;
    }
  },

  // Send appointment status notification to patient
  async sendAppointmentStatusNotification(appointmentData, status, doctorName) {
    const messages = {
      confirmed: {
        title: '✅ Appointment Confirmed!',
        message: `Your appointment with ${doctorName} has been confirmed for ${new Date(appointmentData.appointmentDate.seconds * 1000).toLocaleDateString()} at ${appointmentData.time}.`,
        type: 'success'
      },
      rejected: {
        title: '❌ Appointment Request Declined',
        message: `Your appointment request with ${doctorName} has been declined. Please try booking another slot or contact the doctor directly.`,
        type: 'error'
      }
    };

    const notification = messages[status];
    if (notification) {
      await this.createNotification({
        userId: appointmentData.patientId,
        title: notification.title,
        message: notification.message,
        type: notification.type,
        appointmentId: appointmentData.id,
        category: 'appointment'
      });
    }
  },

  // Send new appointment request notification to doctor
  async sendNewAppointmentNotification(appointmentData) {
    await this.createNotification({
      userId: appointmentData.doctorId,
      title: '🔔 New Appointment Request',
      message: `${appointmentData.patientName} has requested an appointment for ${new Date(appointmentData.appointmentDate.seconds * 1000).toLocaleDateString()} at ${appointmentData.time}.`,
      type: 'info',
      appointmentId: appointmentData.id,
      category: 'appointment_request'
    });
  }
};