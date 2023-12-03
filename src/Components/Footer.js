// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-6">
      <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
        
        <div className="mt-4 lg:mt-0">
          <p>&copy; 2023 Your Company Name. All rights reserved.</p>
          <p>123 Main Street, Cityville, Country</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
