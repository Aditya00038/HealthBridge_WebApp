import React from 'react';
import { motion } from 'framer-motion';

const LoadingSpinner = ({ size = 'md', color = 'primary', text = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const colorClasses = {
    primary: 'border-hb-primary',
    secondary: 'border-hb-secondary',
    white: 'border-white',
    gray: 'border-gray-400'
  };

  return (
    <div className="flex flex-col justify-center items-center space-y-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className={`rounded-full border-4 border-gray-200 ${colorClasses[color]} border-t-transparent ${sizeClasses[size]}`}
      >
        <span className="sr-only">{text}</span>
      </motion.div>
      
      {size !== 'sm' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-sm text-gray-600 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

export default LoadingSpinner;
