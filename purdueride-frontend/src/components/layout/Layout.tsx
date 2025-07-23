import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  /**
   * Whether to show the footer (default: true)
   */
  showFooter?: boolean;
  /**
   * Whether to show the header (default: true)
   */
  showHeader?: boolean;
  /**
   * Additional class names for the main content area
   */
  mainClassName?: string;
}

/**
 * Main layout component that wraps pages with Header and Footer
 * Provides consistent layout across all pages
 */
const Layout = ({ 
  children, 
  showFooter = true, 
  showHeader = true,
  mainClassName = ''
}: LayoutProps) => {
  const location = useLocation();
  
  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {showHeader && <Header />}
      
      <main className={`flex-grow ${showHeader ? 'pt-16' : ''} ${mainClassName}`}>
        {children}
      </main>
      
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;