import React, { useState, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion';
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
    { name: t('videoCall'), href: '/video-call', icon: VideoCameraIcon, premium: true },
    { name: t('aiAssistant'), href: '/chatbot', icon: ChatBubbleLeftRightIcon }
  ];

  const doctorNavigation = [
    { name: t('dashboard'), href: '/doctor/dashboard', icon: UserIcon },
    { name: t('myPatients'), href: '/doctor/patients', icon: UserIcon },
    { name: t('myAppointments'), href: '/doctor/appointments', icon: CalendarDaysIcon },
    { name: t('videoCall'), href: '/video-call', icon: VideoCameraIcon }
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
    <Disclosure as="nav" className="bg-white shadow-hb-lg border-b border-gray-100 sticky top-0 z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3">
                <Link to="/" className="flex items-center space-x-3">
                  <HealthBridgeLogo className="text-2xl" />
                  <div className="hidden sm:block">
                    <div className="text-xs text-gray-500">
                      {t('tagline')}
                    </div>
                  </div>
                </Link>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                {currentNavigation.map((item) => {
                  const isActive = isActivePath(item.href);
                  const isPremiumFeature = item.premium && !hasPremium;
                  
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`
                        relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2
                        ${isActive 
                          ? 'bg-blue-50 text-hb-primary shadow-hb' 
                          : 'text-gray-600 hover:text-hb-primary hover:bg-gray-50'
                        }
                        ${isPremiumFeature ? 'opacity-60' : ''}
                      `}
                    >
                      {item.icon && (
                        <item.icon className={`w-4 h-4 ${isActive ? 'text-hb-primary' : ''}`} />
                      )}
                      <span>{item.name}</span>
                      {isPremiumFeature && (
                        <SparklesIcon className="w-4 h-4 text-amber-500" />
                      )}
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-blue-50 rounded-lg"
                          style={{ zIndex: -1 }}
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>
                  );
                })}
              </div>

              {/* Right Side Actions */}
              <div className="flex items-center space-x-4">
                {/* Language Switcher */}
                <LanguageSwitcher />

                {user ? (
                  <>
                    {/* Notifications */}
                    <NotificationPanel />

                    {/* User Profile Dropdown */}
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="w-8 h-8 bg-gradient-hb-primary rounded-full flex items-center justify-center">
                            <UserCircleIcon className="w-5 h-5 text-white" />
                          </div>
                          <div className="hidden sm:block text-left">
                            <div className="text-sm font-semibold text-gray-900">
                              {userProfile?.name || user?.displayName || 'User'}
                            </div>
                            <div className="text-xs text-gray-500 capitalize">
                              {userProfile?.role || 'Patient'}
                              {hasPremium && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800">
                                  <SparklesIcon className="w-3 h-3 mr-1" />
                                  Premium
                                </span>
                              )}
                            </div>
                          </div>
                          <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right bg-white rounded-xl shadow-hb-lg border border-gray-100 focus:outline-none">
                          <div className="p-2">
                            <Menu.Item>
                              {({ active }) => (
                                <Link
                                  to="/profile/settings"
                                  className={`${
                                    active ? 'bg-gray-50' : ''
                                  } group flex items-center px-3 py-2 text-sm text-gray-700 rounded-lg transition-colors`}
                                >
                                  <UserCircleIcon className="w-5 h-5 mr-3 text-gray-400" />
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
                                    } group flex items-center px-3 py-2 text-sm text-amber-700 rounded-lg transition-colors`}
                                  >
                                    <SparklesIcon className="w-5 h-5 mr-3 text-amber-500" />
                                    Upgrade to Premium
                                  </Link>
                                )}
                              </Menu.Item>
                            )}
                            
                            <div className="border-t border-gray-100 my-2"></div>
                            
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleLogout}
                                  className={`${
                                    active ? 'bg-red-50 text-red-700' : 'text-gray-700'
                                  } group flex items-center px-3 py-2 text-sm rounded-lg transition-colors w-full text-left`}
                                >
                                  <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3 text-red-400" />
                                  {t('logout')}
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  /* Authentication buttons for non-logged in users */
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-hb-primary font-medium transition-colors"
                    >
                      {t('login')}
                    </Link>
                    <Link
                      to="/signup"
                      className="btn-hb-primary text-sm py-2 px-4"
                    >
                      {t('signup')}
                    </Link>
                  </div>
                )}

                {/* Mobile Menu Button */}
                <Disclosure.Button className="md:hidden inline-flex items-center justify-center p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors">
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
          <Disclosure.Panel className="md:hidden border-t border-gray-100">
            <div className="px-4 pt-4 pb-6 space-y-2 bg-gray-50">
              {currentNavigation.map((item) => {
                const isActive = isActivePath(item.href);
                const isPremiumFeature = item.premium && !hasPremium;
                
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`
                      block px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 flex items-center space-x-3
                      ${isActive 
                        ? 'bg-white text-hb-primary shadow-hb' 
                        : 'text-gray-600 hover:text-hb-primary hover:bg-white'
                      }
                      ${isPremiumFeature ? 'opacity-60' : ''}
                    `}
                  >
                    {item.icon && (
                      <item.icon className={`w-5 h-5 ${isActive ? 'text-hb-primary' : ''}`} />
                    )}
                    <span>{item.name}</span>
                    {isPremiumFeature && (
                      <SparklesIcon className="w-4 h-4 text-amber-500 ml-auto" />
                    )}
                  </Link>
                );
              })}

              {user && (
                <>
                  <div className="border-t border-gray-200 my-4"></div>
                  <Link
                    to="/profile/settings"
                    className="px-4 py-3 rounded-xl text-base font-medium text-gray-600 hover:text-hb-primary hover:bg-white transition-all duration-200 flex items-center space-x-3"
                  >
                    <UserCircleIcon className="w-5 h-5" />
                    <span>Profile Settings</span>
                  </Link>
                  
                  {!hasPremium && (
                    <Link
                      to="/pricing"
                      className="px-4 py-3 rounded-xl text-base font-medium text-amber-700 hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200 flex items-center space-x-3"
                    >
                      <SparklesIcon className="w-5 h-5 text-amber-500" />
                      <span>Upgrade to Premium</span>
                    </Link>
                  )}
                  
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 rounded-xl text-base font-medium text-red-600 hover:bg-red-50 transition-all duration-200 flex items-center space-x-3"
                  >
                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    <span>{t('logout')}</span>
                  </button>
                </>
              )}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;