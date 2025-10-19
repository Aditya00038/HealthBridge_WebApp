import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  ClockIcon, 
  PlusIcon, 
  TrashIcon,
  CalendarIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const DoctorSchedule = () => {
  const { user, userProfile } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const [newSchedule, setNewSchedule] = useState({
    day: 'Monday',
    startTime: '09:00',
    endTime: '17:00',
    slotDuration: 30,
    isAvailable: true
  });

  // Load existing schedules
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    setLoading(true);
    try {
      // TODO: Fetch from Firebase
      // For now, using sample data
      setSchedules([
        {
          id: 1,
          day: 'Monday',
          startTime: '09:00',
          endTime: '17:00',
          slotDuration: 30,
          isAvailable: true
        },
        {
          id: 2,
          day: 'Tuesday',
          startTime: '09:00',
          endTime: '17:00',
          slotDuration: 30,
          isAvailable: true
        }
      ]);
    } catch (error) {
      console.error('Error loading schedules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSchedule = async () => {
    try {
      // TODO: Save to Firebase
      const newSched = {
        ...newSchedule,
        id: Date.now()
      };
      setSchedules([...schedules, newSched]);
      setShowAddModal(false);
      setNewSchedule({
        day: 'Monday',
        startTime: '09:00',
        endTime: '17:00',
        slotDuration: 30,
        isAvailable: true
      });
    } catch (error) {
      console.error('Error adding schedule:', error);
    }
  };

  const handleDeleteSchedule = async (id) => {
    try {
      // TODO: Delete from Firebase
      setSchedules(schedules.filter(s => s.id !== id));
    } catch (error) {
      console.error('Error deleting schedule:', error);
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      // TODO: Update in Firebase
      setSchedules(schedules.map(s => 
        s.id === id ? { ...s, isAvailable: !s.isAvailable } : s
      ));
    } catch (error) {
      console.error('Error updating availability:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Schedule</h1>
              <p className="mt-2 text-gray-600">Manage your availability and appointment slots</p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Add Schedule
            </button>
          </div>
        </motion.div>

        {/* Schedule Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule, index) => (
            <motion.div
              key={schedule.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    schedule.isAvailable 
                      ? 'bg-green-100 text-green-600' 
                      : 'bg-gray-100 text-gray-400'
                  }`}>
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900">{schedule.day}</h3>
                    <p className="text-sm text-gray-500">
                      {schedule.isAvailable ? 'Available' : 'Unavailable'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteSchedule(schedule.id)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <TrashIcon className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-gray-700">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-gray-700">
                  <CheckCircleIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm">
                    {schedule.slotDuration} min slots
                  </span>
                </div>
              </div>

              <button
                onClick={() => handleToggleAvailability(schedule.id)}
                className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-all ${
                  schedule.isAvailable
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {schedule.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Add Schedule Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Schedule</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Week
                  </label>
                  <select
                    value={newSchedule.day}
                    onChange={(e) => setNewSchedule({ ...newSchedule, day: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {daysOfWeek.map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Time
                    </label>
                    <input
                      type="time"
                      value={newSchedule.startTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, startTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Time
                    </label>
                    <input
                      type="time"
                      value={newSchedule.endTime}
                      onChange={(e) => setNewSchedule({ ...newSchedule, endTime: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slot Duration (minutes)
                  </label>
                  <select
                    value={newSchedule.slotDuration}
                    onChange={(e) => setNewSchedule({ ...newSchedule, slotDuration: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={45}>45 minutes</option>
                    <option value={60}>60 minutes</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddSchedule}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Add Schedule
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Empty State */}
        {schedules.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <CalendarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No schedules yet</h3>
            <p className="text-gray-600 mb-6">Add your availability to start accepting appointments</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all"
            >
              <PlusIcon className="w-5 h-5" />
              Add Your First Schedule
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default DoctorSchedule;
