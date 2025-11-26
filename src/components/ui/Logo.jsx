import React from 'react';
import { Link } from 'react-router-dom';

const Logo = ({ 
  size = 'md', 
  showText = false,  // Changed default to false - logo only by default
  showConnection = true, // New prop to show/hide connection line
  linkTo = '/',
  className = '' 
}) => {
  // Responsive sizes with connection line considerations
  const sizeClasses = {
    sm: {
      img: 'h-6 sm:h-8 w-auto',
      connection: 'w-12 sm:w-16',
      connectionHeight: 'h-0.5',
      iconSize: 'w-3 h-3 sm:w-4 sm:h-4',
      gap: 'gap-2 sm:gap-3'
    },
    md: {
      img: 'h-8 sm:h-10 lg:h-12 w-auto',
      connection: 'w-16 sm:w-20 lg:w-24',
      connectionHeight: 'h-0.5 sm:h-1',
      iconSize: 'w-4 h-4 sm:w-5 sm:h-5',
      gap: 'gap-2 sm:gap-3 lg:gap-4'
    },
    lg: {
      img: 'h-10 sm:h-12 lg:h-16 w-auto',
      connection: 'w-20 sm:w-24 lg:w-32',
      connectionHeight: 'h-1 sm:h-1.5',
      iconSize: 'w-5 h-5 sm:w-6 sm:h-6',
      gap: 'gap-3 sm:gap-4 lg:gap-5'
    },
    xl: {
      img: 'h-12 sm:h-16 lg:h-20 w-auto',
      connection: 'w-24 sm:w-32 lg:w-40',
      connectionHeight: 'h-1 sm:h-1.5 lg:h-2',
      iconSize: 'w-6 h-6 sm:w-7 sm:h-7',
      gap: 'gap-3 sm:gap-4 lg:gap-6'
    }
  };

  const sizes = sizeClasses[size] || sizeClasses.md;

  // Medical heartbeat/ECG connection line (SVG)
  const ConnectionLine = () => (
    <div className={`flex items-center justify-center ${sizes.connection}`}>
      <svg 
        className={`${sizes.connection} h-8 sm:h-10`}
        viewBox="0 0 128 40" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Gradient Definition */}
        <defs>
          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style={{ stopColor: '#FBBF24', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#F59E0B', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#F97316', stopOpacity: 1 }} />
          </linearGradient>
        </defs>
        
        {/* Heartbeat/ECG Path */}
        <path
          d="M 0 20 L 20 20 L 30 10 L 40 30 L 50 20 L 70 20 L 80 15 L 90 25 L 100 20 L 128 20"
          stroke="url(#connectionGradient)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          className="drop-shadow-sm"
        />
      </svg>
    </div>
  );

  // Medical Plus Signs connection (Alternative)
  const PlusSignsConnection = () => (
    <div className={`flex items-center justify-center ${sizes.gap} ${sizes.connection}`}>
      <span className="text-yellow-500 text-sm sm:text-base lg:text-lg font-bold animate-pulse">+</span>
      <span className="text-amber-500 text-sm sm:text-base lg:text-lg font-bold">+</span>
      <span className="text-orange-500 text-sm sm:text-base lg:text-lg font-bold animate-pulse" style={{ animationDelay: '0.5s' }}>+</span>
    </div>
  );

  // Medical Icon (Pill/Capsule)
  const MedicalIcon = () => (
    <div className={`${sizes.iconSize} text-emerald-600 flex-shrink-0`}>
      <svg 
        viewBox="0 0 24 24" 
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M4.5 12.75a6 6 0 1111.85-1.35l-1.06 1.06A4.5 4.5 0 106.56 17.5l1.06-1.06A6 6 0 014.5 12.75z" />
        <path d="M12.75 4.5a6 6 0 011.35 11.85l-1.06-1.06a4.5 4.5 0 10-4.98-4.98l-1.06-1.06A6 6 0 0112.75 4.5z" />
      </svg>
    </div>
  );

  const LogoContent = () => (
    <div className={`flex items-center ${sizes.gap} ${className}`}>
      {/* Medical Icon */}
      {showConnection && <MedicalIcon />}
      
      {/* Connection Line */}
      {showConnection && <ConnectionLine />}
      
      {/* Logo Image with enhanced background */}
      <div className="bg-white rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-md hover:shadow-lg transition-shadow duration-300">
        <img 
          src="/app-logo.png" 
          alt="CareConnect Logo" 
          className={`${sizes.img} object-contain`}
        />
      </div>
      
      {/* Connection Line (mirrored) */}
      {showConnection && <ConnectionLine />}
      
      {/* Medical Icon (mirrored) */}
      {showConnection && <MedicalIcon />}
    </div>
  );

  if (linkTo) {
    return (
      <Link 
        to={linkTo} 
        className="inline-block hover:scale-105 transition-transform duration-300 ease-in-out"
      >
        <LogoContent />
      </Link>
    );
  }

  return <LogoContent />;
};

export default Logo;
