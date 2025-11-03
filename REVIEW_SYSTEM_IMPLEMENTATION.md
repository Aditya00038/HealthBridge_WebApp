# Review System Implementation Guide 📋

## Current Status

### ✅ Completed
- ReviewModal component created (full UI with validation)
- AppointmentBooking.jsx updated to show real ratings/reviews
- Doctor badges system implemented (⭐ BEST, Top Rated, Experienced)
- Best Doctors ranking algorithm implemented
- Mobile-responsive filter button with active count

### ⏳ Pending
- Review submission functionality
- Firebase service functions for reviews
- Calculate doctor stats from real data
- Firestore security rules for reviews collection

---

## Implementation Steps

### Step 1: Add Review Service Functions

**File:** `src/services/firebaseServices.jsx`

Add these functions to handle reviews:

```javascript
// ==================== REVIEWS ====================

/**
 * Create a new review for a doctor
 */
export const createReview = async (reviewData) => {
  try {
    const reviewRef = await addDoc(collection(db, 'reviews'), {
      ...reviewData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    console.log('Review created with ID:', reviewRef.id);
    
    // Update doctor stats after review submission
    await updateDoctorStats(reviewData.doctorId);
    
    return reviewRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

/**
 * Get all reviews for a specific doctor
 */
export const getReviewsForDoctor = async (doctorId) => {
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
};

/**
 * Calculate and update doctor statistics
 */
export const updateDoctorStats = async (doctorId) => {
  try {
    // Get all reviews for doctor
    const reviews = await getReviewsForDoctor(doctorId);
    
    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + (review.overallRating || 0), 0);
    const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    
    // Calculate detailed ratings
    const avgTreatmentQuality = reviews.reduce((sum, r) => sum + (r.treatmentQuality || 0), 0) / reviews.length;
    const avgCommunication = reviews.reduce((sum, r) => sum + (r.communication || 0), 0) / reviews.length;
    const avgPunctuality = reviews.reduce((sum, r) => sum + (r.punctuality || 0), 0) / reviews.length;
    
    // Get total appointments
    const appointmentsQuery = query(
      collection(db, 'appointments'),
      where('doctorId', '==', doctorId),
      where('status', '==', 'completed')
    );
    const appointmentsSnapshot = await getDocs(appointmentsQuery);
    const totalAppointments = appointmentsSnapshot.size;
    
    // Calculate if doctor is "Best Doctor" (top criteria)
    // You can adjust this threshold based on your needs
    const isBestDoctor = averageRating >= 4.5 && totalAppointments >= 50;
    
    // Update doctor document
    const doctorRef = doc(db, 'doctors', doctorId);
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
      averageRating,
      totalReviews: reviews.length,
      totalAppointments,
      isBestDoctor
    });
    
    return {
      averageRating,
      totalReviews: reviews.length,
      totalAppointments,
      isBestDoctor
    };
  } catch (error) {
    console.error('Error updating doctor stats:', error);
    throw error;
  }
};

/**
 * Check if patient can review an appointment
 */
export const canReviewAppointment = async (appointmentId, patientId) => {
  try {
    // Check if appointment is completed
    const appointmentDoc = await getDoc(doc(db, 'appointments', appointmentId));
    if (!appointmentDoc.exists()) return false;
    
    const appointment = appointmentDoc.data();
    if (appointment.status !== 'completed') return false;
    if (appointment.patientId !== patientId) return false;
    
    // Check if review already exists
    const reviewQuery = query(
      collection(db, 'reviews'),
      where('appointmentId', '==', appointmentId),
      where('patientId', '==', patientId)
    );
    const reviewSnapshot = await getDocs(reviewQuery);
    
    return reviewSnapshot.empty; // Can review if no existing review
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    return false;
  }
};
```

**Export these functions:**
```javascript
export const reviewServices = {
  createReview,
  getReviewsForDoctor,
  updateDoctorStats,
  canReviewAppointment
};
```

---

### Step 2: Update PatientAppointmentsEnhanced.jsx

**File:** `src/pages/PatientAppointmentsEnhanced.jsx`

Add review functionality:

```javascript
import ReviewModal from '../components/ReviewModal';
import { reviewServices } from '../services/firebaseServices';

// Inside component:
const [reviewModalOpen, setReviewModalOpen] = useState(false);
const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState(null);

// Handle opening review modal
const handleOpenReviewModal = async (appointment) => {
  try {
    // Check if patient can review
    const canReview = await reviewServices.canReviewAppointment(
      appointment.id,
      user.uid
    );
    
    if (!canReview) {
      toast.error('You have already reviewed this appointment');
      return;
    }
    
    setSelectedAppointmentForReview(appointment);
    setReviewModalOpen(true);
  } catch (error) {
    console.error('Error checking review eligibility:', error);
    toast.error('Failed to open review form');
  }
};

// Handle review submission
const handleSubmitReview = async (reviewData) => {
  try {
    const fullReviewData = {
      appointmentId: selectedAppointmentForReview.id,
      patientId: user.uid,
      patientName: user.displayName || user.email,
      doctorId: selectedAppointmentForReview.doctorId,
      doctorName: selectedAppointmentForReview.doctorName,
      ...reviewData
    };
    
    await reviewServices.createReview(fullReviewData);
    
    toast.success('Thank you for your review!');
    setReviewModalOpen(false);
    setSelectedAppointmentForReview(null);
    
    // Refresh appointments list
    fetchAppointments();
  } catch (error) {
    console.error('Error submitting review:', error);
    toast.error('Failed to submit review. Please try again.');
  }
};

// In the JSX, add "Write Review" button for completed appointments:
{appointment.status === 'completed' && (
  <button
    onClick={() => handleOpenReviewModal(appointment)}
    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-500 text-white rounded-lg hover:from-teal-600 hover:to-emerald-600 transition-all"
  >
    <StarIcon className="h-4 w-4" />
    Write Review
  </button>
)}

// Add ReviewModal at the end of JSX:
<ReviewModal
  isOpen={reviewModalOpen}
  onClose={() => {
    setReviewModalOpen(false);
    setSelectedAppointmentForReview(null);
  }}
  appointment={selectedAppointmentForReview}
  onSubmit={handleSubmitReview}
/>
```

---

### Step 3: Create Firestore Collection & Indexes

**Create `reviews` collection with this structure:**

```javascript
{
  appointmentId: "appointment123",      // Reference to appointment
  patientId: "patient456",              // Who wrote the review
  patientName: "John Doe",              // Patient display name
  doctorId: "doctor789",                // Which doctor is being reviewed
  doctorName: "Dr. Sarah Johnson",      // Doctor display name
  
  // Ratings (1-5 stars)
  overallRating: 5,                     // Overall experience
  treatmentQuality: 5,                  // Treatment effectiveness
  communication: 4,                     // Doctor communication
  punctuality: 5,                       // Appointment timeliness
  
  // Review text
  reviewText: "Excellent doctor! Very caring and professional.",
  
  // Timestamps
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

**Create Firebase indexes:**

Go to Firebase Console → Firestore Database → Indexes → Add Index

**Index 1: Get reviews for a doctor**
```
Collection: reviews
Fields:
  - doctorId (Ascending)
  - createdAt (Descending)
```

**Index 2: Check if appointment has review**
```
Collection: reviews
Fields:
  - appointmentId (Ascending)
  - patientId (Ascending)
```

---

### Step 4: Update Firestore Security Rules

**File:** `firestore.rules`

Add rules for reviews collection:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // ... existing rules ...
    
    // Reviews collection
    match /reviews/{reviewId} {
      // Allow read for anyone (public reviews)
      allow read: if true;
      
      // Allow create only if:
      // - User is authenticated
      // - User is the patient who wrote the review
      // - Review is for a completed appointment
      allow create: if request.auth != null 
                    && request.auth.uid == request.resource.data.patientId
                    && request.resource.data.appointmentId != null;
      
      // Allow update/delete only by the patient who wrote it
      allow update, delete: if request.auth != null 
                            && request.auth.uid == resource.data.patientId;
    }
  }
}
```

---

### Step 5: Background Job to Update Stats (Optional)

For better performance, you can create a Cloud Function to automatically update doctor stats when a review is created:

**Firebase Cloud Function:**

```javascript
const functions = require('firebase-functions');
const admin = require('firebase-admin');

exports.updateDoctorStatsOnReview = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const doctorId = review.doctorId;
    
    try {
      // Get all reviews for this doctor
      const reviewsSnapshot = await admin.firestore()
        .collection('reviews')
        .where('doctorId', '==', doctorId)
        .get();
      
      const reviews = reviewsSnapshot.docs.map(doc => doc.data());
      
      // Calculate stats
      const totalReviews = reviews.length;
      const averageRating = reviews.reduce((sum, r) => sum + r.overallRating, 0) / totalReviews;
      
      // Get appointment count
      const appointmentsSnapshot = await admin.firestore()
        .collection('appointments')
        .where('doctorId', '==', doctorId)
        .where('status', '==', 'completed')
        .get();
      
      const totalAppointments = appointmentsSnapshot.size;
      const isBestDoctor = averageRating >= 4.5 && totalAppointments >= 50;
      
      // Update doctor document
      await admin.firestore()
        .collection('doctors')
        .doc(doctorId)
        .update({
          averageRating: parseFloat(averageRating.toFixed(2)),
          totalReviews: totalReviews,
          totalAppointments: totalAppointments,
          isBestDoctor: isBestDoctor,
          updatedAt: admin.firestore.FieldValue.serverTimestamp()
        });
      
      console.log(`✅ Doctor stats updated for ${doctorId}`);
    } catch (error) {
      console.error('Error updating doctor stats:', error);
    }
  });
```

---

## Testing Checklist

### Test Review Submission:
- [ ] Patient can submit review after completed appointment
- [ ] Patient cannot review pending/cancelled appointments
- [ ] Patient cannot review twice for same appointment
- [ ] All rating fields are required (1-5 stars)
- [ ] Review text must be at least 10 characters
- [ ] Toast notification shows success message

### Test Doctor Stats Update:
- [ ] `averageRating` calculated correctly from all reviews
- [ ] `totalReviews` count is accurate
- [ ] `totalAppointments` counts only completed appointments
- [ ] `isBestDoctor` flag set correctly (rating ≥ 4.5, appointments ≥ 50)
- [ ] Doctor card displays updated stats immediately

### Test UI Display:
- [ ] Doctors with reviews show star rating and count
- [ ] Doctors without reviews show "New doctor - No reviews yet"
- [ ] Patient count shows real `totalAppointments` number
- [ ] Badges display correctly (⭐ BEST, Top Rated, Experienced)
- [ ] Best Doctors sort works correctly

### Test Mobile Responsiveness:
- [ ] Review modal displays well on mobile
- [ ] Star rating tap/click works on touch devices
- [ ] Review form is easy to fill on mobile
- [ ] Filter button shows active count badge

---

## Expected User Flow

1. **Patient completes appointment** → Status changes to "completed"
2. **Patient sees "Write Review" button** in appointments list
3. **Patient clicks "Write Review"** → ReviewModal opens
4. **Patient rates doctor** → Overall rating + detailed ratings (treatment/communication/punctuality)
5. **Patient writes review text** → Minimum 10 characters
6. **Patient submits review** → Review saved to Firestore
7. **Doctor stats auto-update** → averageRating, totalReviews, totalAppointments, isBestDoctor recalculated
8. **Other patients see updated rating** → Next time they view doctor in booking page

---

## Key Fields to Track

### In `doctors` collection:
```javascript
{
  // ... existing fields ...
  averageRating: 4.7,          // Average of all review ratings
  totalReviews: 89,            // Count of reviews
  totalAppointments: 342,      // Count of completed appointments
  isBestDoctor: true,          // Top doctor flag
  detailedRatings: {
    treatmentQuality: 4.8,
    communication: 4.6,
    punctuality: 4.9
  }
}
```

### In `reviews` collection:
```javascript
{
  appointmentId: "...",
  patientId: "...",
  doctorId: "...",
  overallRating: 5,            // 1-5 stars
  treatmentQuality: 5,         // 1-5 stars
  communication: 4,            // 1-5 stars
  punctuality: 5,              // 1-5 stars
  reviewText: "...",
  createdAt: Timestamp
}
```

---

## Benefits

✅ **Patient feedback** - Patients can share their experience
✅ **Doctor reputation** - Builds trust through real reviews
✅ **Smart rankings** - Best doctors identified by performance
✅ **Quality assurance** - High ratings reward good service
✅ **Transparency** - All patients see honest reviews
✅ **Motivation** - Doctors incentivized to provide better care

---

## Summary

The review system allows patients to rate doctors after completed appointments. These reviews calculate real statistics (average rating, review count, appointment count) which power the "Best Doctors" ranking and display on the booking page. The ReviewModal component is already built and ready to use - just need to add the backend functions and integrate them into the appointments page.

**Next Action**: Implement Step 1 (Add review service functions) and Step 2 (Update PatientAppointmentsEnhanced.jsx) to enable review submission.
