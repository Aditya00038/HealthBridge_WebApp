import React, { useState, Fragment } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Disclosure, Menu, Transition } from '@headlessui/react';
import { 
  Bars3Icon, 
  XMarkIcon, 
  HeartIcon,
  HomeIcon,
  UserIcon,
  CalendarDaysIcon,
  VideoCameraIcon,
  ChatBubbleLeftRightIcon,
  ShoppingBagIcon,
  BellIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  UserCircleIcon,
  CreditCardIcon,
  ChevronDownIcon
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
  const [notifications] = useState([
    { id: 1, message: 'Your appointment with Dr. Smith is tomorrow at 10 AM', unread: true },
    { id: 2, message: 'Your subscription will renew in 3 days', unread: false }
  ]);

  const navigation = [
    { name: t('home'), href: '/', icon: HeartIcon, public: true },
    { name: t('pricing'), href: '/pricing', icon: null, public: true }
  ];

  const patientNavigation = [
    { name: t('dashboard'), href: '/patient/dashboard', icon: UserIcon },
    { name: t('bookAppointment'), href: '/appointment/book', icon: CalendarDaysIcon },
    { name: t('videoCall'), href: '/video-call', icon: VideoCameraIcon, premium: true },
    { name: t('aiAssistant'), href: '/chatbot', icon: ChatBubbleLeftRightIcon }
  ];

  const doctorNavigation = [
    { name: t('dashboard'), href: '/doctor/dashboard', icon: UserIcon },
    { name: t('profileSetup'), href: '/doctor/profile-setup', icon: UserIcon },
    { name: t('myAppointments'), href: '/doctor/appointments', icon: CalendarDaysIcon },
    { name: t('myPatients'), href: '/doctor/patients', icon: UserIcon }
  ];

  const getNavigationItems = () => {
    if (!user) return navigation;
    
    switch (userProfile?.role) {
      case 'patient':
        return [...navigation, ...patientNavigation];
      case 'doctor':
        // Doctors get doctor-specific navigation (no appointment booking)
        return [{ name: 'Home', href: '/', icon: HomeIcon }, ...doctorNavigation];
      case 'admin':
        return [...navigation, { name: 'Admin Dashboard', href: '/admin/dashboard', icon: UserIcon }];
      default:
        return navigation;
    }
  };

  const navigationItems = getNavigationItems();

  const userProfileItems = [
    { name: 'Your Profile', href: '/profile', icon: UserCircleIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    { name: 'Billing', href: '/billing', icon: CreditCardIcon },
  ];

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const unreadNotifications = notifications.filter(n => n.unread).length;

  return (
    <Disclosure as="nav" className="bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200 fixed w-full top-0 z-50">
      {({ open }) => (
        <>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex">
                <div className="flex-shrink-0 flex items-center">
                  <Link to="/" className="flex items-center group">
                    <HealthBridgeLogo size="default" className="mr-3 transition-transform group-hover:scale-105" />
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                      HealthBridge
                    </span>
                  </Link>
                </div>
                
                {/* Desktop Navigation */}
                <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                  {navigationItems.map((item) => {
                    const isActive = location.pathname === item.href || 
                                   (item.href !== '/' && location.pathname.startsWith(item.href));
                    
                    // Check if user can access premium features
                    const canAccess = !item.premium || hasPremium() || item.public;
                    
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                          isActive
                            ? 'border-primary-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        } ${!canAccess ? 'opacity-50' : ''}`}
                      >
                        {item.icon && <item.icon className="h-4 w-4 mr-1" />}
                        {item.name}
                        {item.premium && !hasPremium() && (
                          <span className="ml-1 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                            Pro
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* User Menu */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center space-x-4">
                {user ? (
                  <>
                    {/* Upgrade Button for Patients */}
                    {userProfile?.role === 'patient' && !hasPremium() && (
                      <Link
                        to="/pricing"
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105"
                      >
                        ✨ Upgrade to Pro
                      </Link>
                    )}
                    
                    {/* Language Switcher */}
                    <LanguageSwitcher />
                    
                    {/* Notifications */}
                    <NotificationPanel />

                    {/* User Profile Dropdown */}
                    <Menu as="div" className="relative">
                      <Menu.Button className="flex items-center space-x-2 p-2 text-sm bg-white rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors">
                        <img
                          className="w-8 h-8 rounded-full ring-2 ring-gray-200"
                          src={userProfile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'User')}&background=10b981&color=fff`}
                          alt={userProfile?.name || 'User'}
                        />
                        <div className="hidden md:block text-left">
                          <p className="text-sm font-medium text-gray-900">
                            {userProfile?.name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 capitalize">
                            {userProfile?.role || 'User'}
                          </p>
                        </div>
                        <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                      </Menu.Button>
                      
                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-200"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <img
                                className="w-12 h-12 rounded-full"
                                src={userProfile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'User')}&background=10b981&color=fff`}
                                alt={userProfile?.name || 'User'}
                              />
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {userProfile?.name || 'User'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {userProfile?.email || user?.email}
                                </p>
                                <span className="inline-block px-2 py-1 mt-1 text-xs bg-gray-100 text-gray-600 rounded-full capitalize">
                                  {userProfile?.role || 'User'}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="py-2">
                            {userProfileItems.map((item) => (
                              <Menu.Item key={item.name}>
                                {({ active }) => (
                                  <Link
                                    to={item.href}
                                    className={`${
                                      active ? 'bg-gray-50' : ''
                                    } flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50`}
                                  >
                                    <item.icon className="w-4 h-4 mr-3 text-gray-400" />
                                    {item.name}
                                  </Link>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                          
                          <div className="py-2 border-t border-gray-100">
                            <Menu.Item>
                              {({ active }) => (
                                <button
                                  onClick={handleLogout}
                                  className={`${
                                    active ? 'bg-gray-50' : ''
                                  } flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50`}
                                >
                                  <ArrowRightOnRectangleIcon className="w-4 h-4 mr-3 text-gray-400" />
                                  Sign out
                                </button>
                              )}
                            </Menu.Item>
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </>
                ) : (
                  <div className="flex items-center space-x-3">
                    <Link
                      to="/login"
                      className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-purple-600 transition-all duration-200 transform hover:scale-105 shadow-md"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile menu button */}
              <div className="flex items-center sm:hidden">
                <Disclosure.Button className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500">
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

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
              {navigationItems.map((item) => {
                const isActive = location.pathname === item.href;
                const canAccess = !item.premium || hasPremium() || item.public;
                
                return (
                  <Disclosure.Button
                    key={item.name}
                    as={Link}
                    to={item.href}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive
                        ? 'bg-primary-50 border-primary-500 text-primary-700'
                        : 'border-transparent text-gray-600 hover:text-gray-800 hover:bg-gray-50 hover:border-gray-300'
                    } ${!canAccess ? 'opacity-50' : ''}`}
                  >
                    <div className="flex items-center">
                      {item.icon && <item.icon className="h-5 w-5 mr-2" />}
                      {item.name}
                      {item.premium && !hasPremium() && (
                        <span className="ml-2 px-2 py-0.5 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                          Pro
                        </span>
                      )}
                    </div>
                  </Disclosure.Button>
                );
              })}
            </div>
            
            {/* Mobile user section */}
            {user ? (
              <div className="pt-4 pb-3 border-t border-gray-200">
                <div className="flex items-center px-4">
                  <div className="flex-shrink-0">
                    <img
                      className="h-10 w-10 rounded-full"
                      src={userProfile?.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile?.name || 'User')}&background=10b981&color=fff`}
                      alt={userProfile?.name}
                    />
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-gray-800">{userProfile?.name}</div>
                    <div className="text-sm font-medium text-gray-500 capitalize">{userProfile?.role}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  {userProfile?.role === 'patient' && !hasPremium() && (
                    <Link
                      to="/pricing"
                      className="block px-4 py-2 text-base font-medium text-primary-600 hover:text-primary-500 hover:bg-gray-100"
                    >
                      Upgrade to Pro
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              </div>
            ) : (
              <div className="pt-4 pb-3 border-t border-gray-200 space-y-1">
                <Link
                  to="/login"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign in
                </Link>
                <Link
                  to="/signup"
                  className="block px-4 py-2 text-base font-medium text-primary-600 hover:text-primary-500 hover:bg-gray-100"
                >
                  Get Started
                </Link>
              </div>
            )}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
