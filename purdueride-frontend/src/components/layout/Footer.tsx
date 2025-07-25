import { Link } from 'react-router-dom';

/**
 * Footer component for PurdueRide application
 * Provides contact information, links, and copyright information
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-8" role="contentinfo" aria-label="Site footer">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Column 1 - About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-purdue-gold">PurdueRide</h3>
            <p className="text-gray-300 mb-4">
              Affordable campus transportation for Purdue University students. 
              Fixed $3 rides to and from campus.
            </p>
            <div className="text-gray-300">
              <p className="mb-1">Purdue University</p>
              <p className="mb-1">West Lafayette, IN 47907</p>
            </div>
          </div>
          
          {/* Column 2 - Services */}
          <div>
            <h3 id="services-heading" className="text-lg font-bold mb-4 text-purdue-gold">Services</h3>
            <ul className="space-y-2" aria-labelledby="services-heading">
              <li>
                <Link to="/ride" className="text-gray-300 hover:text-purdue-gold transition-colors py-2 min-h-[44px] flex items-center">
                  Request a ride
                </Link>
              </li>
              <li>
                <Link to="/reserve" className="text-gray-300 hover:text-purdue-gold transition-colors py-2 min-h-[44px] flex items-center">
                  Reserve a ride
                </Link>
              </li>
              <li>
                <Link to="/pricing" className="text-gray-300 hover:text-purdue-gold transition-colors py-2 min-h-[44px] flex items-center">
                  Pricing
                </Link>
              </li>
              <li>
                <Link to="/drive" className="text-gray-300 hover:text-purdue-gold transition-colors py-2 min-h-[44px] flex items-center">
                  Become a driver
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 3 - Support */}
          <div>
            <h3 id="support-heading" className="text-lg font-bold mb-4 text-purdue-gold">Support</h3>
            <ul className="space-y-2" aria-labelledby="support-heading">
              <li>
                <Link to="/help" className="text-gray-300 hover:text-purdue-gold transition-colors py-2 min-h-[44px] flex items-center">
                  Help center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-purdue-gold transition-colors py-2 min-h-[44px] flex items-center">
                  Contact us
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-gray-300 hover:text-purdue-gold transition-colors py-2 min-h-[44px] flex items-center">
                  Safety
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-purdue-gold transition-colors py-2 min-h-[44px] flex items-center">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Column 4 - Contact */}
          <div>
            <h3 id="contact-heading" className="text-lg font-bold mb-4 text-purdue-gold">Contact Us</h3>
            <ul className="space-y-2" aria-labelledby="contact-heading">
              <li className="flex items-center text-gray-300 py-2 min-h-[44px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:info@purdueride.com" className="hover:text-purdue-gold transition-colors">
                  info@purdueride.com
                </a>
              </li>
              <li className="flex items-center text-gray-300 py-2 min-h-[44px]">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+17654441234" className="hover:text-purdue-gold transition-colors">
                  (765) 444-1234
                </a>
              </li>
              <li className="mt-4">
                <h4 className="text-sm font-semibold mb-2 text-gray-300">Hours of Operation:</h4>
                <p className="text-gray-300 text-sm">Monday - Friday: 7am - 11pm</p>
                <p className="text-gray-300 text-sm">Saturday - Sunday: 9am - 9pm</p>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social Media Links */}
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center">
          <div className="flex space-x-6 mb-4 md:mb-0">
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-purdue-gold transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Facebook"
            >
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-purdue-gold transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Instagram"
            >
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            <a 
              href="https://twitter.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-gray-300 hover:text-purdue-gold transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Twitter"
            >
              <span className="sr-only">Twitter</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
          </div>
          
          <div className="text-gray-400 text-sm text-center">
            &copy; {currentYear} PurdueRide. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;