import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white py-4 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-slate-500">
          &copy; {new Date().getFullYear()} AROGYA. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;