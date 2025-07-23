import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from './LoadingSpinner';

describe('LoadingSpinner Component', () => {
  it('renders correctly with default props', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    
    const svg = spinner.querySelector('svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveClass('h-8 w-8'); // md size
    expect(svg).toHaveClass('text-purdue-gold'); // primary color
    
    const srOnly = screen.getByText('Loading');
    expect(srOnly).toBeInTheDocument();
    expect(srOnly).toHaveClass('sr-only');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(<LoadingSpinner size="sm" />);
    let svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-4 w-4');
    
    rerender(<LoadingSpinner size="md" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-8 w-8');
    
    rerender(<LoadingSpinner size="lg" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('h-12 w-12');
  });

  it('renders with different colors', () => {
    const { rerender } = render(<LoadingSpinner color="primary" />);
    let svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('text-purdue-gold');
    
    rerender(<LoadingSpinner color="secondary" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('text-gray-800');
    
    rerender(<LoadingSpinner color="white" />);
    svg = screen.getByRole('status').querySelector('svg');
    expect(svg).toHaveClass('text-white');
  });

  it('renders centered when centered prop is true', () => {
    render(<LoadingSpinner centered />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('flex');
    expect(spinner).toHaveClass('items-center');
    expect(spinner).toHaveClass('justify-center');
  });

  it('renders with text when provided', () => {
    render(<LoadingSpinner text="Loading data..." />);
    
    const text = screen.getByText('Loading data...');
    expect(text).toBeInTheDocument();
    expect(text).toHaveClass('mt-2');
  });

  it('applies custom className', () => {
    render(<LoadingSpinner className="custom-class" />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(<LoadingSpinner />);
    
    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-live', 'polite');
    
    const svg = spinner.querySelector('svg');
    expect(svg).toHaveAttribute('aria-hidden', 'true');
  });
});