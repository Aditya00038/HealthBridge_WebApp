import React, { useState, useEffect } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';
import { UserCircleIcon } from '@heroicons/react/24/outline';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import LoadingSpinner from '@/components/ui/LoadingSpinner';

const ReviewList = ({ doctorId, showReviewForm = false }) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    fetchReviews();
  }, [doctorId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('doctorId', '==', doctorId),
        orderBy('createdAt', 'desc')
      );

      const reviewSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate()
      }));

      setReviews(reviewsData);
      calculateStats(reviewsData);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (reviewsData) => {
    if (reviewsData.length === 0) {
      setStats({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
      return;
    }

    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviewsData.length;

    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      distribution[review.rating]++;
    });

    setStats({
      averageRating: averageRating.toFixed(1),
      totalReviews: reviewsData.length,
      ratingDistribution: distribution
    });
  };

  const formatDate = (date) => {
    if (!date) return 'Recently';
    const now = new Date();
    const diff = now - date;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              <div className="text-5xl font-bold text-indigo-600">
                {stats.averageRating}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-5 h-5 ${
                        star <= Math.round(stats.averageRating)
                          ? 'text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-slate-600 mt-1">
                  Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = stats.ratingDistribution[rating];
              const percentage = stats.totalReviews > 0
                ? (count / stats.totalReviews) * 100
                : 0;

              return (
                <div key={rating} className="flex items-center gap-2">
                  <div className="flex items-center gap-1 w-12">
                    <span className="text-sm font-medium text-slate-700">{rating}</span>
                    <StarIcon className="w-3 h-3 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs text-slate-600 w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-slate-200">
          <StarIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">No reviews yet</h3>
          <p className="text-slate-600">Be the first to review this doctor</p>
        </div>
      ) : (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-900">
            Patient Reviews ({reviews.length})
          </h3>
          
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {review.patientPhoto ? (
                    <img
                      src={review.patientPhoto}
                      alt={review.patientName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center">
                      <UserCircleIcon className="w-8 h-8 text-indigo-600" />
                    </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-slate-900">{review.patientName}</h4>
                    <p className="text-xs text-slate-500">{formatDate(review.createdAt)}</p>
                  </div>
                </div>

                {/* Star Rating */}
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      className={`w-4 h-4 ${
                        star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <p className="text-slate-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewList;
