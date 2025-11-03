import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '@/firebase/config';
import ReviewList from '@/components/reviews/ReviewList';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import {
  StarIcon,
  ChartBarIcon,
  UserGroupIcon,
  TrophyIcon
} from '@heroicons/react/24/outline';

const DoctorReviews = () => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    ratingBreakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });

  useEffect(() => {
    fetchReviews();
  }, [user]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const reviewsQuery = query(
        collection(db, 'reviews'),
        where('doctorId', '==', user.uid),
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
      return;
    }

    const totalRating = reviewsData.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = totalRating / reviewsData.length;

    const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviewsData.forEach(review => {
      breakdown[review.rating]++;
    });

    setStats({
      totalReviews: reviewsData.length,
      averageRating: averageRating.toFixed(1),
      ratingBreakdown: breakdown
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Reviews</h1>
          <p className="text-slate-600">
            See what your patients are saying about your service
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Total Reviews */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Total Reviews</p>
                <p className="text-3xl font-bold text-slate-900">{stats.totalReviews}</p>
              </div>
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                <UserGroupIcon className="w-6 h-6 text-indigo-600" />
              </div>
            </div>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Average Rating</p>
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-bold text-slate-900">{stats.averageRating}</p>
                  <StarIcon className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <TrophyIcon className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          {/* 5-Star Reviews */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">5-Star Reviews</p>
                <p className="text-3xl font-bold text-slate-900">{stats.ratingBreakdown[5]}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <StarIcon className="w-6 h-6 text-green-600 fill-green-600" />
              </div>
            </div>
          </div>

          {/* Response Rate */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-600 mb-1">Satisfaction</p>
                <p className="text-3xl font-bold text-slate-900">
                  {stats.totalReviews > 0
                    ? Math.round((stats.averageRating / 5) * 100)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <ChartBarIcon className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-sm">
            <StarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No reviews yet</h3>
            <p className="text-slate-600">
              Your reviews will appear here once patients start sharing their experiences
            </p>
          </div>
        ) : (
          <ReviewList doctorId={user.uid} />
        )}
      </div>
    </div>
  );
};

export default DoctorReviews;
