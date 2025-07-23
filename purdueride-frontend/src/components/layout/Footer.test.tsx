import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Footer from './Footer';

describe('Footer Component', () => {
  const renderFooter = () => {
    return render(
      <BrowserRouter>
        <Footer />
      </BrowserRouter>
    );
  };

  test('renders the PurdueRide branding', () => {
    renderFooter();
    
    // Check for PurdueRide text
    const brandName = screen.getByText('PurdueRide', { selector: 'h3' });
    expect(brandName).toBeInTheDocument();
  });

  test('renders contact information', () => {
    renderFooter();
    
    // Check for contact information
    expect(screen.getByText('info@purdueride.com')).toBeInTheDocument();
    expect(screen.getByText('(765) 444-1234')).toBeInTheDocument();
    expect(screen.getByText('Hours of Operation:')).toBeInTheDocument();
    expect(screen.getByText('Monday - Friday: 7am - 11pm')).toBeInTheDocument();
    expect(screen.getByText('Saturday - Sunday: 9am - 9pm')).toBeInTheDocument();
  });

  test('renders service links', () => {
    renderFooter();
    
    // Check for service links
    expect(screen.getByText('Request a ride')).toBeInTheDocument();
    expect(screen.getByText('Reserve a ride')).toBeInTheDocument();
    expect(screen.getByText('Pricing')).toBeInTheDocument();
    expect(screen.getByText('Become a driver')).toBeInTheDocument();
  });

  test('renders support links', () => {
    renderFooter();
    
    // Check for support links
    expect(screen.getByText('Help center')).toBeInTheDocument();
    expect(screen.getByText('Contact us')).toBeInTheDocument();
    expect(screen.getByText('Safety')).toBeInTheDocument();
    expect(screen.getByText('FAQ')).toBeInTheDocument();
  });

  test('renders social media links', () => {
    renderFooter();
    
    // Check for social media links
    expect(screen.getByLabelText('Facebook')).toBeInTheDocument();
    expect(screen.getByLabelText('Instagram')).toBeInTheDocument();
    expect(screen.getByLabelText('Twitter')).toBeInTheDocument();
  });

  test('renders copyright information with current year', () => {
    renderFooter();
    
    const currentYear = new Date().getFullYear();
    const copyrightText = screen.getByText((content) => {
      return content.includes(`© ${currentYear} PurdueRide. All rights reserved.`);
    });
    
    expect(copyrightText).toBeInTheDocument();
  });
});