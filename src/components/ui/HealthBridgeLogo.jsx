import React from 'react';

const HealthBridgeLogo = ({ size = 'default', className = '', ...props }) => {
  const textSizes = {
    small: 'text-lg',
    default: 'text-xl',
    large: 'text-2xl',
    xl: 'text-3xl'
  };

  return (
    <span className={`inline-flex items-center ${className}`} {...props}>
      <span className="bg-white rounded-lg px-3 py-1.5 shadow-sm">
        <img
          src="/app-logo.png"
          alt="CareConnect"
          className="h-10 w-auto"
          style={{ maxWidth: 280 }}
        />
      </span>
    </span>
  );
};

export default HealthBridgeLogo;