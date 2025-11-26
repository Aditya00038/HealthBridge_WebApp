import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createCamp } from '../../services/campServices';
import { Timestamp } from 'firebase/firestore';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserGroupIcon,
  HeartIcon,
  BuildingOfficeIcon,
  ShieldCheckIcon,
  LifebuoyIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const campTypes = [
  { id: 'blood_donation', name: 'Blood Donation Camp', icon: HeartIcon, color: 'red' },
  { id: 'dental_camp', name: 'Dental Camp', icon: BuildingOfficeIcon, color: 'orange' },
  { id: 'treatment_camp', name: 'General Treatment Camp', icon: ShieldCheckIcon, color: 'emerald' },
  { id: 'vaccination', name: 'Vaccination Camp', icon: LifebuoyIcon, color: 'purple' },
  { id: 'eye_camp', name: 'Eye Camp', icon: SparklesIcon, color: 'teal' }
];

const DoctorCreateCamp = () => {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    title: '',
    description: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    date: '',
    startTime: '',
    endTime: '',
    capacity: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type) newErrors.type = 'Please select a camp type';
    if (!formData.title) newErrors.title = 'Title is required';
    if (!formData.description) newErrors.description = 'Description is required';
    if (!formData.address) newErrors.address = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.state) newErrors.state = 'State is required';
    if (!formData.pincode) newErrors.pincode = 'Pincode is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    if (!formData.endTime) newErrors.endTime = 'End time is required';
    if (!formData.capacity) newErrors.capacity = 'Capacity is required';
    
    // Validate date is not in past
    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      newErrors.date = 'Date cannot be in the past';
    }
    
    // Validate capacity is positive
    if (formData.capacity && parseInt(formData.capacity) <= 0) {
      newErrors.capacity = 'Capacity must be greater than 0';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix all errors before submitting');
      return;
    }
    
    setLoading(true);
    
    try {
      // Geocode address (simplified - using city for coordinates)
      // In production, use Google Geocoding API
      const coordinates = {
        lat: 28.7041 + (Math.random() - 0.5) * 0.1, // Delhi region with randomness
        lng: 77.1025 + (Math.random() - 0.5) * 0.1
      };
      
      // Convert date string to Timestamp
      const campDate = new Date(formData.date);
      
      const campData = {
        type: formData.type,
        title: formData.title,
        description: formData.description,
        organizerId: user.uid,
        organizerName: userProfile?.name || 'Dr. Unknown',
        organizerSpecialty: userProfile?.specialty || 'General',
        location: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          coordinates: coordinates
        },
        date: Timestamp.fromDate(campDate),
        startTime: formData.startTime,
        endTime: formData.endTime,
        capacity: parseInt(formData.capacity),
      };
      
      const result = await createCamp(campData);
      
      if (result.success) {
        toast.success('Health camp created successfully!');
        navigate('/doctor/dashboard');
      }
    } catch (error) {
      console.error('Error creating camp:', error);
      toast.error('Failed to create camp. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 py-8 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto"
      >
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Create Health Camp</h1>
          <p className="text-gray-600">
            Organize a health camp to serve the community. Patients can discover and register for your camp.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {/* Camp Type Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4">
              Camp Type *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {campTypes.map((type) => {
                const Icon = type.icon;
                const isSelected = formData.type === type.id;
                return (
                  <motion.button
                    key={type.id}
                    type="button"
                    onClick={() => handleChange({ target: { name: 'type', value: type.id } })}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      isSelected
                        ? `border-${type.color}-500 bg-${type.color}-50`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mx-auto mb-2 ${
                      isSelected ? `text-${type.color}-600` : 'text-gray-400'
                    }`} />
                    <p className={`text-sm font-medium ${
                      isSelected ? `text-${type.color}-700` : 'text-gray-700'
                    }`}>
                      {type.name}
                    </p>
                  </motion.button>
                );
              })}
            </div>
            {errors.type && <p className="text-red-500 text-sm mt-2">{errors.type}</p>}
          </div>

          {/* Title */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Camp Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Free Blood Donation Drive 2024"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe the camp, what services will be provided, and any special instructions..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
          </div>

          {/* Location */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPinIcon className="h-5 w-5 inline mr-2" />
              Location Details
            </label>
            <div className="space-y-4">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Street Address *"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
                </div>
                <div>
                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State *"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                  {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state}</p>}
                </div>
              </div>
              
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Pincode *"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              {errors.pincode && <p className="text-red-500 text-sm">{errors.pincode}</p>}
            </div>
          </div>

          {/* Date and Time */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <CalendarIcon className="h-5 w-5 inline mr-2" />
              Date and Time
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
              </div>
              <div>
                <input
                  type="time"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {errors.startTime && <p className="text-red-500 text-sm mt-1">{errors.startTime}</p>}
              </div>
              <div>
                <input
                  type="time"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                {errors.endTime && <p className="text-red-500 text-sm mt-1">{errors.endTime}</p>}
              </div>
            </div>
          </div>

          {/* Capacity */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <UserGroupIcon className="h-5 w-5 inline mr-2" />
              Maximum Capacity *
            </label>
            <input
              type="number"
              name="capacity"
              value={formData.capacity}
              onChange={handleChange}
              placeholder="e.g., 100"
              min="1"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            {errors.capacity && <p className="text-red-500 text-sm mt-1">{errors.capacity}</p>}
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/doctor/dashboard')}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Camp'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default DoctorCreateCamp;
