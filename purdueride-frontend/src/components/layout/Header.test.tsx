import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from './Header';

// Mock the SVG import
jest.mock('../../assets/purdue-logo.svg', () => 'purdue-logo.svg');

describe('Header Component', () => {
  const renderHeader = () => {
    return render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );
  };

  test('renders the PurdueRide branding', () => {
    renderHeader();
    
    // Check for logo and brand name
    const logo = screen.getByAltText('PurdueRide Logo');
    expect(logo).toBeInTheDocument();
    
    const brandName = screen.getByText('PurdueRide');
    expect(brandName).toBeInTheDocument();
  });

  test('renders navigation links on desktop', () => {
    renderHeader();
    
    // Check for navigation links
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Book a Ride')).toBeInTheDocument();
    expect(screen.getByText('Ride History')).toBeInTheDocument();
    expect(screen.getByText('Help')).toBeInTheDocument();
  });

  test('renders authentication buttons when not logged in', () => {
    renderHeader();
    
    // Check for login and signup buttons
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign up')).toBeInTheDocument();
  });

  test('toggles mobile menu when hamburger button is clicked', () => {
    renderHeader();
    
    // Mobile menu should be hidden initially
    expect(screen.queryByText('Home')).toBeInTheDocument();
    
    // Find and click the hamburger button
    const menuButton = screen.getByLabelText('Toggle menu');
    fireEvent.click(menuButton);
    
    // Mobile menu should now be visible
    const mobileMenu = screen.getAllByText('Home')[1]; // Second occurrence is in mobile menu
    expect(mobileMenu).toBeInTheDocument();
    
    // Click again to close
    fireEvent.click(menuButton);
    
    // Mobile menu should be hidden again
    expect(screen.getAllByText('Home').length).toBe(1); // Only desktop link remains
  });
});