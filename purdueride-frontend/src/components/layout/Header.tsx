import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import purdueLogo from '../../assets/purdue-logo.svg';

/**
 * Header component for PurdueRide application
 * Provides responsive navigation with mobile hamburger menu
 * and displays authentication state
 */
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  // Handle click outside of user menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle logout
  const handleLogout = async () => {
    await logout();
    setIsUserMenuOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo and Branding */}
        <Link to="/" className="flex items-center" aria-label="PurdueRide Home">
          <img
            src={purdueLogo}
            alt="Purdue University Logo"
            className="h-10 w-auto"
            onError={(e) => {
              e.currentTarget.src = 'https://www.purdue.edu/purdue/images/logo.png';
            }}
          />
          <span className="ml-2 text-xl font-bold text-purdue-black">PurdueRide</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8" aria-label="Main navigation">
          <Link to="/" className="text-gray-700 hover:text-purdue-gold transition-colors focus:outline-none focus:ring-2 focus:ring-purdue-gold focus:ring-offset-2 rounded-md p-2">
            Home
          </Link>
          <Link to="/ride-request" className="text-gray-700 hover:text-purdue-gold transition-colors focus:outline-none focus:ring-2 focus:ring-purdue-gold focus:ring-offset-2 rounded-md p-2">
            Book a Ride
          </Link>
          <Link to="/rides" className="text-gray-700 hover:text-purdue-gold transition-colors focus:outline-none focus:ring-2 focus:ring-purdue-gold focus:ring-offset-2 rounded-md p-2">
            Available Rides
          </Link>
          {isAuthenticated && (
            <Link to="/profile" className="text-gray-700 hover:text-purdue-gold transition-colors focus:outline-none focus:ring-2 focus:ring-purdue-gold focus:ring-offset-2 rounded-md p-2">
              My Profile
            </Link>
          )}
        </nav>

        {/* User Authentication Menu - Desktop */}
        <div className="hidden md:block">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={toggleUserMenu}
                className="flex items-center space-x-2 text-gray-700 hover:text-purdue-gold transition-colors focus:outline-none focus:ring-2 focus:ring-purdue-gold focus:ring-offset-2 rounded-md p-2"
                aria-expanded={isUserMenuOpen}
                aria-haspopup="true"
                aria-label="User menu"
                aria-controls="user-menu-dropdown"
              >
                <span>My Account</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {isUserMenuOpen && (
                <div
                  ref={userMenuRef}
                  id="user-menu-dropdown"
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-purdue-gold"
                    role="menuitem"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 focus:text-purdue-gold"
                    role="menuitem"
                    onClick={handleLogout}
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
          className="md:hidden text-gray-700 hover:text-purdue-gold transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-purdue-gold focus:ring-offset-2 rounded-md"
          aria-expanded={isMenuOpen}
          aria-label="Toggle navigation menu"
          aria-controls="mobile-menu"
        >
          {isMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div id="mobile-menu" className="md:hidden bg-white border-t border-gray-200 py-2" role="navigation" aria-label="Mobile navigation">
          <div className="container mx-auto px-4 flex flex-col space-y-2">
            <Link
              to="/"
              className="text-gray-700 hover:text-purdue-gold transition-colors py-3 min-h-[44px] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/ride-request"
              className="text-gray-700 hover:text-purdue-gold transition-colors py-3 min-h-[44px] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Book a Ride
            </Link>
            <Link
              to="/rides"
              className="text-gray-700 hover:text-purdue-gold transition-colors py-3 min-h-[44px] flex items-center"
              onClick={() => setIsMenuOpen(false)}
            >
              Available Rides
            </Link>
            {isAuthenticated && (
              <Link
                to="/profile"
                className="text-gray-700 hover:text-purdue-gold transition-colors py-3 min-h-[44px] flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                My Profile
              </Link>
            )}

            {/* User Authentication Menu - Mobile */}
            <div className="pt-2 border-t border-gray-200">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profile"
                    className="block py-3 min-h-[44px] flex items-center text-gray-700 hover:text-purdue-gold transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Profile
                  </Link>
                  <button
                    className="block w-full text-left py-3 min-h-[44px] flex items-center text-gray-700 hover:text-purdue-gold transition-colors"
                    onClick={handleLogout}
                  >
                    Sign out
                  </button>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-purdue-gold transition-colors py-3 min-h-[44px] flex items-center"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="bg-purdue-gold hover:bg-yellow-600 text-white px-4 py-3 min-h-[44px] flex items-center justify-center rounded-md transition-colors text-center"
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