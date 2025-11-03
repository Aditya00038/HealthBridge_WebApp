import React from 'react';
import { Link } from 'react-router-dom';

const FooterClean = () => {
  const navigation = {
    product: [
      { name: 'Features', href: '/#features' },
      { name: 'Pricing', href: '/pricing' },
      { name: 'Security', href: '/security' },
    ],
    company: [
      { name: 'About', href: '/about' },
      { name: 'Blog', href: '/blog' },
      { name: 'Careers', href: '/careers' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Contact', href: '/contact' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy', href: '/privacy' },
      { name: 'Terms', href: '/terms' },
      { name: 'HIPAA', href: '/hipaa' },
    ],
  };

  return (
    <footer className="bg-white border-t border-slate-200 dark:bg-slate-950 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 sm:gap-8 mb-6 sm:mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <div className="bg-white dark:bg-slate-800 rounded-lg px-3 py-2 shadow-sm">
                <img 
                  src="/company-logo.png" 
                  alt="CareConnect" 
                  className="h-8 w-auto"
                />
              </div>
            </Link>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Modern healthcare for everyone, everywhere.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-3">Product</h3>
            <ul className="space-y-2">
              {navigation.product.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-xs sm:text-sm text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-3">Company</h3>
            <ul className="space-y-2">
              {navigation.company.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-xs sm:text-sm text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-3">Support</h3>
            <ul className="space-y-2">
              {navigation.support.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-xs sm:text-sm text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white mb-3">Legal</h3>
            <ul className="space-y-2">
              {navigation.legal.map((item) => (
                <li key={item.name}>
                  <Link to={item.href} className="text-xs sm:text-sm text-slate-600 hover:text-teal-600 dark:text-slate-400 dark:hover:text-teal-400 transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center sm:text-left">
              © {new Date().getFullYear()} HealthBridge. All rights reserved.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 text-center sm:text-right">
              Made with <span className="text-red-500">❤️</span> for better healthcare
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterClean;
