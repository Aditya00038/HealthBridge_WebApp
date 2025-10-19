import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile as updateFirebaseProfile
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc,
  collection,
  query,
  where,
  getDocs 
} from 'firebase/firestore';
import { auth, db } from '@/firebase/config';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [subscription, setSubscription] = useState(null);

  // Initialize auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        
        try {
          // Get user profile from Firestore
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserProfile(userData);
          } else {
            // Create a basic profile if it doesn't exist
            const basicProfile = {
              uid: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
              email: firebaseUser.email,
              role: 'patient', // Default role
              phone: '',
              profileImage: '',
              isVerified: false,
              createdAt: new Date(),
              updatedAt: new Date()
            };
            
            try {
              await setDoc(doc(db, 'users', firebaseUser.uid), basicProfile);
              setUserProfile(basicProfile);
            } catch (createError) {
              console.error('Error creating user profile:', createError);
              // Set profile in state even if Firestore write fails
              setUserProfile(basicProfile);
            }
          }
          
          // Get subscription data
          try {
            const subscriptionDoc = await getDoc(doc(db, 'subscriptions', firebaseUser.uid));
            if (subscriptionDoc.exists()) {
              setSubscription(subscriptionDoc.data());
            } else {
              // Create default free subscription
              const defaultSubscription = {
                userId: firebaseUser.uid,
                plan: 'free',
                status: 'active',
                features: ['physical_appointments', 'basic_chatbot'],
                createdAt: new Date(),
                updatedAt: new Date()
              };
              
              try {
                await setDoc(doc(db, 'subscriptions', firebaseUser.uid), defaultSubscription);
                setSubscription(defaultSubscription);
              } catch (subError) {
                console.error('Error creating subscription:', subError);
                setSubscription(defaultSubscription);
              }
            }
          } catch (subscriptionError) {
            console.error('Error fetching subscription data:', subscriptionError);
            // Set default subscription even if Firestore fails
            setSubscription({
              userId: firebaseUser.uid,
              plan: 'free',
              status: 'active',
              features: ['physical_appointments', 'basic_chatbot']
            });
          }
          
        } catch (error) {
          console.error('Error fetching user data:', error);
          
          // Fallback: set basic profile even if Firestore completely fails
          const fallbackProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            email: firebaseUser.email,
            role: 'patient',
            phone: '',
            profileImage: '',
            isVerified: false,
          };
          setUserProfile(fallbackProfile);
          
          // Set basic subscription
          setSubscription({
            userId: firebaseUser.uid,
            plan: 'free',
            status: 'active',
            features: ['physical_appointments', 'basic_chatbot']
          });
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setSubscription(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Login function
  const login = async (email, password, role) => {
    try {
      setLoading(true);
      
      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Get user profile to verify role
      try {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        
        if (!userDoc.exists()) {
          // Create a basic user profile if it doesn't exist
          const basicProfile = {
            uid: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email,
            role: role,
            phone: '',
            profileImage: '',
            isVerified: false,
            createdAt: new Date(),
            updatedAt: new Date()
          };
          
          await setDoc(doc(db, 'users', firebaseUser.uid), basicProfile);
          setUserProfile(basicProfile);
          
          // Create default subscription
          const defaultSubscription = {
            userId: firebaseUser.uid,
            plan: 'free',
            status: 'active',
            features: ['physical_appointments', 'basic_chatbot'],
            createdAt: new Date(),
            updatedAt: new Date()
          };
          await setDoc(doc(db, 'subscriptions', firebaseUser.uid), defaultSubscription);
          setSubscription(defaultSubscription);
          
          toast.success(`Welcome back!`);
          return { success: true };
        }
        
        const userData = userDoc.data();
        
        // Allow login if no role specified or if role matches
        if (role && userData.role && userData.role !== role) {
          await signOut(auth);
          throw new Error(`Invalid credentials for ${role} login`);
        }
        
        setUserProfile(userData);
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true };
        
      } catch (firestoreError) {
        console.error('Firestore error:', firestoreError);
        // If Firestore fails, still allow login but with limited functionality
        const basicProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          email: firebaseUser.email,
          role: role || 'patient',
          phone: '',
          profileImage: '',
          isVerified: false,
        };
        setUserProfile(basicProfile);
        toast.success(`Welcome back!`);
        return { success: true };
      }
      
    } catch (error) {
      let message = 'Login failed';
      if (error.code === 'auth/user-not-found') {
        message = 'No account found with this email';
      } else if (error.code === 'auth/wrong-password') {
        message = 'Incorrect password';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      setLoading(true);
      
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        userData.email, 
        userData.password
      );
      const firebaseUser = userCredential.user;
      
      // Update Firebase profile
      await updateFirebaseProfile(firebaseUser, {
        displayName: userData.name
      });
      
      // Create user profile in Firestore
      const userProfile = {
        uid: firebaseUser.uid,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        phone: userData.phone || '',
        dateOfBirth: userData.dateOfBirth || null,
        gender: userData.gender || '',
        address: userData.address || '',
        profileImage: '',
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      // Add role-specific fields
      if (userData.role === 'doctor') {
        userProfile.specialization = userData.specialization || '';
        userProfile.licenseNumber = userData.licenseNumber || '';
        userProfile.experience = userData.experience || 0;
        userProfile.consultationFee = userData.consultationFee || 0;
        userProfile.videoConsultationFee = userData.videoConsultationFee || 0;
        userProfile.isApproved = true; // Auto-approve doctors
        userProfile.profileStatus = 'approved';
        userProfile.approvedAt = new Date();
        userProfile.rating = 4.5; // Default good rating
        userProfile.totalReviews = 0;
        userProfile.available = true;
      }
      
      await setDoc(doc(db, 'users', firebaseUser.uid), userProfile);
      
      // Create default subscription
      const defaultSubscription = {
        userId: firebaseUser.uid,
        plan: 'free',
        status: 'active',
        features: ['physical_appointments', 'basic_chatbot'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await setDoc(doc(db, 'subscriptions', firebaseUser.uid), defaultSubscription);
      
      toast.success(`Welcome to HealthBridge, ${userData.name}!`);
      return { success: true };
      
    } catch (error) {
      let message = 'Signup failed';
      if (error.code === 'auth/email-already-in-use') {
        message = 'An account with this email already exists';
      } else if (error.code === 'auth/weak-password') {
        message = 'Password should be at least 6 characters';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Invalid email address';
      } else if (error.message) {
        message = error.message;
      }
      
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('No user logged in');
      
      // Update Firebase profile if name changed
      if (profileData.name && profileData.name !== user.displayName) {
        await updateFirebaseProfile(user, {
          displayName: profileData.name
        });
      }
      
      // Update Firestore document
      const updatedData = {
        ...profileData,
        updatedAt: new Date()
      };
      
      await updateDoc(doc(db, 'users', user.uid), updatedData);
      
      // Update local state
      setUserProfile(prev => ({ ...prev, ...updatedData }));
      
      toast.success('Profile updated successfully');
      return { success: true };
    } catch (error) {
      const message = error.message || 'Profile update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  // Check if user has premium subscription
  const hasPremium = () => {
    return subscription && 
           subscription.status === 'active' && 
           ['premium', 'pro'].includes(subscription.plan);
  };

  // Check if user can access feature
  const canAccessFeature = (feature) => {
    if (!user || !subscription) return false;
    
    const freeFeatures = ['physical_appointments', 'basic_chatbot'];
    const premiumFeatures = ['video_appointments', 'full_chatbot', 'priority_support'];
    
    if (freeFeatures.includes(feature)) return true;
    if (premiumFeatures.includes(feature)) return hasPremium();
    
    return subscription.features?.includes(feature) || false;
  };

  // Get user's daily chatbot usage
  const getChatbotUsage = async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const q = query(
        collection(db, 'chatbotUsage'),
        where('userId', '==', user?.uid),
        where('date', '>=', today)
      );
      
      const querySnapshot = await getDocs(q);
      return querySnapshot.size;
    } catch (error) {
      console.error('Error getting chatbot usage:', error);
      return 0;
    }
  };

  const value = {
    user,
    userProfile,
    subscription,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    updateUserProfile: updateProfile, // Alias for clarity
    hasPremium,
    canAccessFeature,
    getChatbotUsage
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
