import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bars3Icon, 
  XMarkIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';

const NavbarClean = () => {
  const { user, userProfile } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navClasses = 'fixed top-0 left-0 right-0 z-50 bg-white/95 border-b border-slate-200 backdrop-blur-sm transition-colors duration-300';
  const brandAccentClasses = 'bg-indigo-600 hover:bg-indigo-700 text-white';
  const brandTitleClasses = 'text-xl font-semibold text-slate-900';
  const navLinkBase = 'text-sm font-medium text-slate-600 hover:text-slate-900 transition-all relative pb-1';
  const navLinkActive = 'text-indigo-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-600 after:rounded-full';
  const settingsLinkClasses = 'flex items-center gap-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors';
  const authLinkSignIn = 'px-4 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors';
  const authLinkCTA = 'px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors';
  const mobileMenuWrapperClasses = 'md:hidden border-t border-slate-200 bg-white/98 backdrop-blur-sm transition-colors';
  const mobileNavLinkBase = 'block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors border-l-4 border-transparent';
  const mobileNavLinkActive = 'bg-indigo-50 text-indigo-600 border-l-4 border-indigo-600 font-semibold';
  const mobileSettingsClasses = 'block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors';
  const mobileSignInLink = 'block px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors';
  const mobileSignInCTA = 'block px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium text-center hover:bg-indigo-700 transition-colors';
  const mobileButtonClasses = 'md:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors';

  const publicNavigation = [
    { name: 'Features', href: '/#features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'About', href: '/#about' }
  ];

  const patientNavigation = [
    { name: 'Dashboard', href: '/patient/dashboard' },
    { name: 'Book Appointment', href: '/appointment/book' },
    { name: 'Video Calls', href: '/patient/video-appointments' },
    { name: 'AI Assistant', href: '/chatbot' },
    { name: 'Prescriptions', href: '/patient/prescriptions' },
    { name: 'Locate', href: '/locate' }
  ];

  const doctorNavigation = [
    { name: 'Dashboard', href: '/doctor/dashboard' },
    { name: 'My Schedule', href: '/doctor/schedule' },
    { name: 'Appointments', href: '/doctor/appointments' },
    { name: 'Patient Records', href: '/doctor/patient-records' }
  ];

  const medicineSellerNavigation = [
    { name: 'Dashboard', href: '/medicine-seller/dashboard' },
    { name: 'Orders', href: '/medicine-seller/dashboard' }
  ];

  const currentNavigation = user 
    ? (userProfile?.role === 'doctor' 
        ? doctorNavigation 
        : userProfile?.role === 'medicine-seller'
          ? medicineSellerNavigation
          : patientNavigation)
    : publicNavigation;

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="flex items-center">
              <img src="/app-logo.png" alt="CareConnect" className="h-16 w-auto" />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`${navLinkBase} ${
                  isActivePath(item.href) ? navLinkActive : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link
                to="/profile/settings"
                className={settingsLinkClasses}
              >
                <Cog6ToothIcon className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className={authLinkSignIn}
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className={authLinkCTA}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={mobileButtonClasses}
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="w-6 h-6" />
            ) : (
              <Bars3Icon className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className={mobileMenuWrapperClasses}>
          <div className="px-6 py-4 space-y-3">
            {currentNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`${mobileNavLinkBase} ${
                  isActivePath(item.href) ? mobileNavLinkActive : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            
            <div className="pt-3 border-t border-slate-200">
              {user ? (
                <Link
                  to="/profile/settings"
                  onClick={() => setMobileMenuOpen(false)}
                  className={mobileSettingsClasses}
                >
                  Settings
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileSignInLink}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className={mobileSignInCTA}
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavbarClean;
