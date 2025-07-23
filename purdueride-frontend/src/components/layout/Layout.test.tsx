import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

// Mock the Header and Footer components
jest.mock('./Header', () => {
  return function MockHeader() {
    return <div data-testid="header">Header Component</div>;
  };
});

jest.mock('./Footer', () => {
  return function MockFooter() {
    return <div data-testid="footer">Footer Component</div>;
  };
});

describe('Layout Component', () => {
  const renderLayout = (props = {}) => {
    return render(
      <BrowserRouter>
        <Layout {...props}>
          <div data-testid="content">Page Content</div>
        </Layout>
      </BrowserRouter>
    );
  };

  test('renders header, content, and footer by default', () => {
    renderLayout();
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('can hide header when showHeader is false', () => {
    renderLayout({ showHeader: false });
    
    expect(screen.queryByTestId('header')).not.toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  test('can hide footer when showFooter is false', () => {
    renderLayout({ showFooter: false });
    
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('content')).toBeInTheDocument();
    expect(screen.queryByTestId('footer')).not.toBeInTheDocument();
  });

  test('applies padding top when header is shown', () => {
    renderLayout();
    
    const mainElement = screen.getByTestId('content').parentElement;
    expect(mainElement).toHaveClass('pt-16');
  });

  test('does not apply padding top when header is hidden', () => {
    renderLayout({ showHeader: false });
    
    const mainElement = screen.getByTestId('content').parentElement;
    expect(mainElement).not.toHaveClass('pt-16');
  });

  test('applies custom main class name', () => {
    renderLayout({ mainClassName: 'custom-class' });
    
    const mainElement = screen.getByTestId('content').parentElement;
    expect(mainElement).toHaveClass('custom-class');
  });
});