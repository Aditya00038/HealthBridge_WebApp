import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6">
              <div className="bg-white rounded-lg px-4 py-2 inline-block shadow-lg">
                <img 
                  src="/company-logo.png" 
                  alt="CareConnect" 
                  className="h-10 w-auto"
                />
              </div>
            </div>
            <p className="text-gray-300 mb-6 max-w-md text-sm sm:text-base leading-relaxed">
              Your trusted healthcare companion - reducing travel time and costs with online and offline medical solutions.
            </p>
            <div className="flex flex-wrap gap-4">
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Facebook</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-teal-400 transition-colors">Instagram</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Quick Links</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><Link to="/" className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors">Home</Link></li>
              <li><Link to="/pricing" className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors">Pricing</Link></li>
              <li><Link to="/about" className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold mb-4 text-white">Support</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors">Help Center</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="text-sm sm:text-base text-gray-300 hover:text-teal-400 transition-colors">HIPAA Compliance</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 sm:pt-8 mt-8 sm:mt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-left">
              © 2025 HealthBridge. All rights reserved.
            </p>
            <p className="text-gray-400 text-xs sm:text-sm text-center sm:text-right">
              Made with <span className="text-red-500">❤️</span> for better healthcare access
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
