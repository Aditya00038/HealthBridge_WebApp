import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { StarIcon as StarOutlineIcon } from '@heroicons/react/24/outline';
import { collection, addDoc, query, where, getDocs, orderBy, serverTimestamp } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ doctorId, appointmentId, onReviewSubmitted }) => {
  const { user, userProfile } = useAuth();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (!comment.trim()) {
      toast.error('Please write a review');
      return;
    }

    try {
      setLoading(true);
      
      const reviewData = {
        doctorId,
        appointmentId,
        patientId: user.uid,
        patientName: userProfile?.displayName || user.displayName || 'Anonymous',
        patientPhoto: userProfile?.profilePhoto || user.photoURL || null,
        rating,
        comment: comment.trim(),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      
      toast.success('Review submitted successfully!');
      setRating(0);
      setComment('');
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-4">Write a Review</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Star Rating */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Rating
          </label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="focus:outline-none transition-transform hover:scale-110"
              >
                {star <= (hoverRating || rating) ? (
                  <StarIcon className="w-8 h-8 text-yellow-400" />
                ) : (
                  <StarOutlineIcon className="w-8 h-8 text-gray-300" />
                )}
              </button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-slate-600">
                {rating} {rating === 1 ? 'star' : 'stars'}
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-slate-700 mb-2">
            Your Review
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows="4"
            placeholder="Share your experience with this doctor..."
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            required
          />
          <p className="mt-1 text-xs text-slate-500">
            {comment.length}/500 characters
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || rating === 0 || !comment.trim()}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
