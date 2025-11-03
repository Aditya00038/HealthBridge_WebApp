import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import toast from 'react-hot-toast';

const ReviewModal = ({ isOpen, onClose, appointment, onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState('');
  const [treatmentQuality, setTreatmentQuality] = useState(0);
  const [communication, setCommunication] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (review.trim().length < 10) {
      toast.error('Please write at least 10 characters in your review');
      return;
    }

    setSubmitting(true);
    
    try {
      await onSubmit({
        rating,
        review: review.trim(),
        treatmentQuality: treatmentQuality || rating,
        communication: communication || rating,
        punctuality: punctuality || rating
      });
      
      // Reset form
      setRating(0);
      setReview('');
      setTreatmentQuality(0);
      setCommunication(0);
      setPunctuality(0);
      
      toast.success('✅ Review submitted successfully!');
      onClose();
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const RatingStars = ({ value, onChange, hoverValue, onHover, label }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => onHover && onHover(star)}
            onMouseLeave={() => onHover && onHover(0)}
            className="transition-transform hover:scale-110"
          >
            {star <= (hoverValue || value) ? (
              <StarSolidIcon className="w-8 h-8 text-yellow-400" />
            ) : (
              <StarIcon className="w-8 h-8 text-gray-300" />
            )}
          </button>
        ))}
      </div>
    </div>
  );

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Rate Your Experience</h2>
              <p className="text-sm text-gray-600 mt-1">
                With Dr. {appointment?.doctorName}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <XMarkIcon className="w-6 h-6 text-gray-500" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Overall Rating */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6">
              <RatingStars
                value={rating}
                onChange={setRating}
                hoverValue={hoverRating}
                onHover={setHoverRating}
                label="Overall Rating *"
              />
              {rating > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {rating === 5 && '🌟 Excellent!'}
                  {rating === 4 && '😊 Very Good!'}
                  {rating === 3 && '👍 Good'}
                  {rating === 2 && '😐 Fair'}
                  {rating === 1 && '😞 Needs Improvement'}
                </p>
              )}
            </div>

            {/* Detailed Ratings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <RatingStars
                  value={treatmentQuality}
                  onChange={setTreatmentQuality}
                  label="Treatment Quality"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <RatingStars
                  value={communication}
                  onChange={setCommunication}
                  label="Communication"
                />
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <RatingStars
                  value={punctuality}
                  onChange={setPunctuality}
                  label="Punctuality"
                />
              </div>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review *
              </label>
              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                placeholder="Share your experience with this doctor..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Minimum 10 characters ({review.length}/10)
              </p>
            </div>

            {/* Appointment Details */}
            <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
              <p><strong>Appointment Date:</strong> {appointment?.date}</p>
              <p><strong>Type:</strong> {appointment?.type}</p>
              <p><strong>Status:</strong> {appointment?.status}</p>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || rating === 0}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ReviewModal;
