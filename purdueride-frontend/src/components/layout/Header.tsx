import { useState } from 'react';
import { Link } from 'react-router-dom';
import purdueLogo from '../../assets/purdue-logo.svg';

/**
 * Header component for PurdueRide application
 * Provides responsive navigation with mobile hamburger menu
 * and displays authentication state
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Mock authentication state - would come from auth context in a real app
  const isAuthenticated = false;

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  // We'll use this function later when implementing click-outside behavior
  // const closeUserMenu = () => {
  //   if (isUserMenuOpen) setIsUserMenuOpen(false);
  // };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Branding */}
        <Link to="/" className="flex items-center">
          <img
            src={purdueLogo}
            alt="PurdueRide Logo"
            className="h-10 w-auto"
            onError={(e) => {
              e.currentTarget.src = 'https://www.purdue.edu/purdue/images/logo.png';
            }}
          />
          <span className="ml-2 text-xl font-bold text-purdue-black">PurdueRide</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link to="/" className="text-gray-700 hover:text-purdue-gold transition-colors">
            Home
          </Link>
          <Link to="/ride" className="text-gray-700 hover:text-purdue-gold transition-colors">
            Book a Ride
          </Link>
          <Link to="/history" className="text-gray-700 hover:text-purdue-gold transition-colors">
            Ride History
          </Link>
          <Link to="/help" className="text-gray-700 hover:text-purdue-gold transition-colors">
            Help
          </Link>
        </nav>

        {/* User Authentication Menu - Desktop */}
        <div className="hidden md:block">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-purdue-gold transition-colors"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
              >
                <span>My Account</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 hover:text-purdue-gold transition-colors"
              >
                Log in
              </Link>
              <Link
                to="/register"
                className="bg-purdue-gold hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-gray-700 hover:text-purdue-gold transition-colors"
          aria-expanded={isMenuOpen}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 py-2">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link
              to="/"
              className="text-gray-700 hover:text-purdue-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/ride"
              className="text-gray-700 hover:text-purdue-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Ride
            </Link>
            <Link
              to="/history"
              className="text-gray-700 hover:text-purdue-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Ride History
            </Link>
            <Link
              to="/help"
              className="text-gray-700 hover:text-purdue-gold transition-colors py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Help
            </Link>

            {/* User Authentication Menu - Mobile */}
            <div className="pt-2 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-2 text-gray-700 hover:text-purdue-gold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    to="/settings"
                    className="block py-2 text-gray-700 hover:text-purdue-gold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    className="block w-full text-left py-2 text-gray-700 hover:text-purdue-gold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-purdue-gold transition-colors py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-purdue-gold hover:bg-yellow-600 text-white px-4 py-2 rounded-md transition-colors text-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;