import React from 'react';
import { FaLinkedin, FaTwitter, FaInstagram, FaFacebook, FaGithub } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function Footer() {
  return (
    <footer className="w-full bg-white/80 backdrop-blur-sm shadow-inner mt-20 px-6">
      <div className="w-full px-8 py-8 sm:px-12 lg:px-16 xl:px-20">
        {/* New expanded footer content with grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* About ClassSync */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">About ClassSync</h3>
            <p className="text-sm text-gray-600">
              ClassSync is a comprehensive school management system designed to streamline classroom operations, 
              enhance teacher-student communication, and simplify administrative tasks.
            </p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Quick Links</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li><Link to="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
              <li><Link to="/faq" className="hover:text-indigo-600 transition-colors">FAQ</Link></li>
            </ul>
          </div>
          
          {/* Contact Information */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Contact Us</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>Email: support@classsync.com</li>
              <li>Phone: (555) 123-4567</li>
              <li>Address: 123 Education St, Learning City</li>
            </ul>
          </div>
          
          {/* Social Media */}
          <div>
            <h3 className="text-gray-800 font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4 text-gray-600">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                <FaLinkedin size={20} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                <FaTwitter size={20} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                <FaFacebook size={20} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                <FaInstagram size={20} />
              </a>
              <a href="https://github.com/dhananjay6561/ClassSync" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 transition-colors">
                <FaGithub size={20} />
              </a>
            </div>
          </div>
        </div>
        
        {/* Original footer content preserved with a separator */}
        <div className="border-t border-gray-200 pt-6 flex flex-col lg:flex-row justify-between items-center text-sm text-gray-600 space-y-4 lg:space-y-0">
          <p>&copy; 2025 ClassSync. All rights reserved.</p>
          
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6">
            <div className="flex space-x-4">
              <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;