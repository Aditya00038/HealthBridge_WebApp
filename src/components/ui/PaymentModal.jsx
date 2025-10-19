import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  XMarkIcon,
  CreditCardIcon,
  BanknotesIcon,
  CheckCircleIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  appointment, 
  onPaymentComplete,
  isProcessing = false 
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const formatExpiryDate = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return v.slice(0, 2) + (v.length > 2 ? '/' + v.slice(2, 4) : '');
    }
    return v;
  };

  const handleCardInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'cardNumber') {
      setCardDetails({ ...cardDetails, cardNumber: formatCardNumber(value) });
    } else if (name === 'expiryDate') {
      setCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(value) });
    } else if (name === 'cvv') {
      setCardDetails({ ...cardDetails, cvv: value.replace(/\D/g, '').slice(0, 4) });
    } else {
      setCardDetails({ ...cardDetails, [name]: value });
    }
  };

  const handlePayment = async () => {
    if (paymentMethod === 'card') {
      // Validate card details
      if (!cardDetails.cardNumber || !cardDetails.cardName || !cardDetails.expiryDate || !cardDetails.cvv) {
        alert('Please fill in all card details');
        return;
      }
    }

    await onPaymentComplete(paymentMethod, paymentMethod === 'card' ? cardDetails : null);
  };

  if (!appointment) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-lg rounded-xl">
                      <CreditCardIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Secure Payment</h2>
                      <p className="text-blue-100 text-sm mt-1">Complete your appointment booking</p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-lg transition-all"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Appointment Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8 border border-blue-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Appointment Details</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-700">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                        <span>Doctor:</span>
                      </div>
                      <span className="font-semibold text-gray-900">{appointment.doctorName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-700">
                        <CalendarIcon className="w-5 h-5 text-purple-600" />
                        <span>Date:</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {new Date(appointment.appointmentDate).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-gray-700">
                        <ClockIcon className="w-5 h-5 text-green-600" />
                        <span>Time:</span>
                      </div>
                      <span className="font-semibold text-gray-900">{appointment.appointmentTime}</span>
                    </div>
                    <div className="pt-3 mt-3 border-t border-blue-200 flex items-center justify-between">
                      <span className="text-lg font-bold text-gray-900">Total Amount:</span>
                      <span className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        ${appointment.consultationFee || '50.00'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Select Payment Method</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* Card Payment */}
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        paymentMethod === 'card'
                          ? 'border-blue-600 bg-blue-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`p-4 rounded-full ${
                          paymentMethod === 'card' ? 'bg-blue-100' : 'bg-gray-100'
                        }`}>
                          <CreditCardIcon className={`w-8 h-8 ${
                            paymentMethod === 'card' ? 'text-blue-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900">Card Payment</div>
                          <div className="text-sm text-gray-600 mt-1">Debit/Credit Card</div>
                        </div>
                      </div>
                      {paymentMethod === 'card' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3"
                        >
                          <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </button>

                    {/* Cash Payment */}
                    <button
                      onClick={() => setPaymentMethod('cash')}
                      className={`relative p-6 rounded-xl border-2 transition-all ${
                        paymentMethod === 'cash'
                          ? 'border-green-600 bg-green-50 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className={`p-4 rounded-full ${
                          paymentMethod === 'cash' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <BanknotesIcon className={`w-8 h-8 ${
                            paymentMethod === 'cash' ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                        <div className="text-center">
                          <div className="font-bold text-gray-900">Pay at Clinic</div>
                          <div className="text-sm text-gray-600 mt-1">Cash on Arrival</div>
                        </div>
                      </div>
                      {paymentMethod === 'cash' && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3"
                        >
                          <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                            <CheckCircleIcon className="w-4 h-4 text-white" />
                          </div>
                        </motion.div>
                      )}
                    </button>
                  </div>
                </div>

                {/* Card Details Form */}
                <AnimatePresence mode="wait">
                  {paymentMethod === 'card' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-8 overflow-hidden"
                    >
                      <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                        <h4 className="text-md font-bold text-gray-900 mb-4 flex items-center gap-2">
                          <LockClosedIcon className="w-5 h-5 text-green-600" />
                          Card Information
                        </h4>
                        <div className="space-y-4">
                          {/* Card Number */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Card Number
                            </label>
                            <input
                              type="text"
                              name="cardNumber"
                              value={cardDetails.cardNumber}
                              onChange={handleCardInputChange}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg tracking-wider"
                            />
                          </div>

                          {/* Cardholder Name */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Cardholder Name
                            </label>
                            <input
                              type="text"
                              name="cardName"
                              value={cardDetails.cardName}
                              onChange={handleCardInputChange}
                              placeholder="JOHN DOE"
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                            />
                          </div>

                          {/* Expiry Date & CVV */}
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Expiry Date
                              </label>
                              <input
                                type="text"
                                name="expiryDate"
                                value={cardDetails.expiryDate}
                                onChange={handleCardInputChange}
                                placeholder="MM/YY"
                                maxLength="5"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                CVV
                              </label>
                              <input
                                type="text"
                                name="cvv"
                                value={cardDetails.cvv}
                                onChange={handleCardInputChange}
                                placeholder="123"
                                maxLength="4"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Security Notice */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start gap-3">
                    <ShieldCheckIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-bold text-green-900 mb-1">Secure Payment</h4>
                      <p className="text-sm text-green-700 leading-relaxed">
                        Your payment information is encrypted and secure. We use industry-standard SSL encryption to protect your data.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={onClose}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className="flex-1 px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isProcessing ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {paymentMethod === 'card' ? (
                          <>
                            <LockClosedIcon className="w-5 h-5" />
                            Pay ${appointment.consultationFee || '50.00'}
                          </>
                        ) : (
                          <>
                            <CheckCircleIcon className="w-5 h-5" />
                            Confirm Booking
                          </>
                        )}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PaymentModal;
