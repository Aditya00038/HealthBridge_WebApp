import React from 'react';

const HealthBridgeLogo = ({ size = 'default', className = '' }) => {
  const textSizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <span className={`font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap ${textSizes[size]} ${className}`}>
      HealthBridge
    </span>
  );
};

export default HealthBridgeLogo;