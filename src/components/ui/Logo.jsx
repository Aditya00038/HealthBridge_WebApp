import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ 
  size = 'md', 
  showText = false,  // Changed default to false - logo only by default
  linkTo = '/',
  className = '' 
}) => {
  // Larger sizes to accommodate full logo with text in image
  const sizeClasses = {
    sm: {
      img: 'h-8 w-auto',  // Auto width to maintain aspect ratio
    },
    md: {
      img: 'h-12 w-auto',
    },
    lg: {
      img: 'h-16 w-auto',
    },
    xl: {
      img: 'h-20 w-auto',
    }
  };

  const sizes = sizeClasses[size] || sizeClasses.md;

  const LogoContent = () => (
    <div className={`flex items-center ${className}`}>
      {/* Logo Image with background - Full logo with text included in image */}
      <div className="bg-white rounded-lg px-3 py-2 shadow-sm">
        <img 
          src="/company-logo.png" 
          alt="CareConnect Logo" 
          className={`${sizes.img} object-contain`}
        />
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-block hover:opacity-80 transition-opacity">
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;
