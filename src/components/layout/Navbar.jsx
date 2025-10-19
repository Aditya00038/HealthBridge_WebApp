import React, { useState, Fragment, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';
import { 
  Bars3Icon, 
  XMarkIcon,
  HomeIcon,
  UserIcon,
  CalendarDaysIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CreditCardIcon,
  ChevronDownIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '../../contexts/LanguageContext';
import NotificationPanel from '../NotificationPanel';
import HealthBridgeLogo from '../ui/HealthBridgeLogo';
import LanguageSwitcher from '../ui/LanguageSwitcher';

const Navbar = () => {
  const { user, userProfile, logout, hasPremium } = useAuth();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const { scrollY } = useScroll();

  // Handle scroll effect
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Public navigation items
  const publicNavigation = [
    { name: t('home'), href: '/', icon: HomeIcon },
    { name: t('pricing'), href: '/pricing', icon: CreditCardIcon }
  ];

  // Role-based navigation
  const patientNavigation = [
    { name: t('dashboard'), href: '/patient/dashboard', icon: UserIcon },
    { name: t('bookAppointment'), href: '/appointment/book', icon: CalendarDaysIcon },
    { name: t('aiAssistant'), href: '/chatbot', icon: ChatBubbleLeftRightIcon },
    { name: 'History', href: '/patient/history', icon: CalendarDaysIcon }
  ];

  const doctorNavigation = [
    { name: 'Dashboard', href: '/doctor/dashboard', icon: UserIcon },
    { name: 'My Schedule', href: '/doctor/schedule', icon: CalendarDaysIcon },
    { name: 'Appointments', href: '/doctor/appointments', icon: CalendarDaysIcon },
    { name: 'Patient Records', href: '/doctor/patient-records', icon: UserIcon }
  ];

  const currentNavigation = user 
    ? (userProfile?.role === 'doctor' ? doctorNavigation : patientNavigation)
    : publicNavigation;

  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <Disclosure 
      as={motion.nav}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'backdrop-blur-xl bg-white/80 shadow-soft border-b border-slate-200/50' 
          : 'bg-white/95 shadow-sm'
      }`}
    >
      {({ open }) => (
        <>
          <div className="container-app">
            <div className="flex justify-between items-center h-20">
              {/* Logo and Brand */}
              <motion.div 
                className="flex items-center gap-3"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <Link to="/" className="flex items-center gap-3 group">
                  <div className="relative">
                    <HealthBridgeLogo className="text-2xl transition-transform group-hover:scale-110" />
                    {isScrolled && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-primary-500 to-secondary-500 rounded-full"
                      />
                    )}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs text-slate-500 group-hover:text-primary-500 transition-colors">
                      {t('tagline')}
                    </div>
                  </div>
                </Link>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-2">
                {currentNavigation.map((item, index) => {
                  const isActive = isActivePath(item.href);
                  const isPremiumFeature = item.premium && !hasPremium;
                  
                  return (
                    <motion.div
                      key={item.name}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.href}
                        className={`
                          relative px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 
                          flex items-center gap-2 group
                          ${isActive 
                            ? 'text-primary-600 bg-gradient-to-r from-primary-50 to-secondary-50 shadow-soft' 
                            : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                          }
                          ${isPremiumFeature ? 'opacity-70' : ''}
                        `}
                      >
                        {item.icon && (
                          <item.icon className={`w-5 h-5 transition-all ${
                            isActive ? 'text-primary-500' : 'text-slate-400 group-hover:text-primary-500'
                          }`} />
                        )}
                        <span>{item.name}</span>
                        {isPremiumFeature && (
                          <SparklesIcon className="w-4 h-4 text-amber-500 animate-pulse" />
                        )}
                        {isActive && (
                          <motion.div
                            layoutId="activeTab"
                            className="absolute inset-0 bg-gradient-to-r from-primary-50 to-secondary-50 rounded-xl -z-10"
                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                          />
                        )}
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center gap-3">
                {/* Language Switcher */}
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <LanguageSwitcher />
                </motion.div>

                {user ? (
                  <>
                    {/* Notifications */}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <NotificationPanel />
                    </motion.div>

                    {/* User Profile Dropdown */}
                    <Menu as="div" className="relative">
                      <Menu.Button as={motion.button} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <div className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors">
                          {userProfile?.photoURL ? (
                            <img 
                              src={userProfile.photoURL} 
                              alt="Profile" 
                              className="w-10 h-10 rounded-full object-cover ring-2 ring-primary-500/20"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center shadow-glow">
                              <span className="text-white font-bold text-sm">
                                {(userProfile?.name || user?.displayName || 'U')[0].toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="hidden lg:block text-left">
                            <div className="text-sm font-bold text-slate-900">
                              {userProfile?.name || user?.displayName || 'User'}
                            </div>
                            <div className="text-xs text-slate-500 capitalize flex items-center gap-2">
                              {userProfile?.role || 'Patient'}
                              {hasPremium && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-sm">
                                  <SparklesIcon className="w-3 h-3 mr-0.5" />
                                  PRO
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDownIcon className="w-4 h-4 text-slate-400" />
                        </div>
                      </Menu.Button>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95 -translate-y-2"
                        enterTo="transform opacity-100 scale-100 translate-y-0"
                        leave="transition ease-in duration-150"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-3 w-64 origin-top-right card-glass p-2 focus:outline-none animate-slide-down">
                          {/* Profile Header */}
                          <div className="px-4 py-3 border-b border-slate-200/50 mb-2">
                            <div className="text-sm font-bold text-slate-900">
                              {userProfile?.name || user?.displayName}
                            </div>
                            <div className="text-xs text-slate-500">
                              {user?.email}
                            </div>
                          </div>

                          <Menu.Item>
                            {({ active }) => (
                              <Link
                                to="/profile/settings"
                                className={`${
                                  active ? 'bg-slate-100' : ''
                                } group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-slate-700 rounded-lg transition-all`}
                              >
                                <UserCircleIcon className="w-5 h-5 text-slate-400 group-hover:text-primary-500 transition-colors" />
                                Profile Settings
                              </Link>
                            )}
                          </Menu.Item>
                          
                          {!hasPremium && (
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/pricing"
                                  className={`${
                                    active ? 'bg-gradient-to-r from-amber-50 to-orange-50' : ''
                                  } group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-amber-700 rounded-lg transition-all`}
                                >
                                  <SparklesIcon className="w-5 h-5 text-amber-500" />
                                  <div>
                                    <div className="font-bold">Upgrade to Premium</div>
                                    <div className="text-xs text-amber-600">Unlock all features</div>
                                  </div>
                                </Link>
                              )}
                            </Menu.Item>
                          )}
                          
                          <div className="border-t border-slate-200/50 my-2"></div>
                          
                          <Menu.Item>
                            {({ active }) => (
                              <button
                                onClick={handleLogout}
                                className={`${
                                  active ? 'bg-red-50' : ''
                                } group flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-600 rounded-lg transition-all w-full text-left`}
                              >
                                <ArrowRightOnRectangleIcon className="w-5 h-5 text-red-400" />
                                {t('logout')}
                              </button>
                            )}
                          </Menu.Item>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  /* Authentication buttons for non-logged in users */
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className="btn-ghost btn-sm"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-primary btn-sm"
                    >
                      {t('signup')}
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Button */}
                <Disclosure.Button 
                  as={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="md:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-all"
                >
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation Menu */}
          <Transition
            enter="transition duration-200 ease-out"
            enterFrom="opacity-0 -translate-y-4"
            enterTo="opacity-100 translate-y-0"
            leave="transition duration-150 ease-in"
            leaveFrom="opacity-100 translate-y-0"
            leaveTo="opacity-0 -translate-y-4"
          >
            <Disclosure.Panel className="md:hidden border-t border-slate-200/50 backdrop-blur-xl bg-white/95">
              <div className="px-4 pt-4 pb-6 space-y-2">
                {currentNavigation.map((item) => {
                  const isActive = isActivePath(item.href);
                  const isPremiumFeature = item.premium && !hasPremium;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl text-base font-semibold transition-all duration-200
                        ${isActive 
                          ? 'bg-gradient-to-r from-primary-50 to-secondary-50 text-primary-600 shadow-soft' 
                          : 'text-slate-600 hover:text-primary-600 hover:bg-slate-50'
                        }
                        ${isPremiumFeature ? 'opacity-70' : ''}
                      `}
                    >
                      {item.icon && (
                        <item.icon className={`w-6 h-6 ${isActive ? 'text-primary-500' : 'text-slate-400'}`} />
                      )}
                      <span>{item.name}</span>
                      {isPremiumFeature && (
                        <SparklesIcon className="w-5 h-5 text-amber-500 ml-auto animate-pulse" />
                      )}
                    </Link>
                  );
                })}

                {user && (
                  <>
                    <div className="border-t border-slate-200/50 my-4"></div>
                    <Link
                      to="/profile/settings"
                      className="px-4 py-3 rounded-xl text-base font-semibold text-slate-600 hover:text-primary-600 hover:bg-slate-50 transition-all duration-200 flex items-center gap-3"
                    >
                      <UserCircleIcon className="w-6 h-6 text-slate-400" />
                      <span>Profile Settings</span>
                    </Link>
                    
                    {!hasPremium && (
                      <Link
                        to="/pricing"
                        className="px-4 py-3 rounded-xl text-base font-semibold text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200 flex items-center gap-3"
                      >
                        <SparklesIcon className="w-6 h-6 text-amber-500" />
                        <div>
                          <div>Upgrade to Premium</div>
                          <div className="text-xs text-amber-600 font-normal">Unlock all features</div>
                        </div>
                      </Link>
                    )}
                    
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 rounded-xl text-base font-semibold text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center gap-3"
                    >
                      <ArrowRightOnRectangleIcon className="w-6 h-6" />
                      <span>{t('logout')}</span>
                    </button>
                  </>
                )}
              </div>
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
