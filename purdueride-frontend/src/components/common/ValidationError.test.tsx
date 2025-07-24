import { render, screen, cleanup } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';
import ValidationError from './ValidationError';

describe('ValidationError', () => {
  afterEach(() => {
    cleanup();
  });

  it('renders nothing when no error is provided', () => {
    const { container } = render(<ValidationError />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when error exists but field is not touched', () => {
    const { container } = render(
      <ValidationError error="This field is required" touched={false} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders error message when error exists and field is touched', () => {
    render(
      <ValidationError error="This field is required" touched={true} />
    );
    
    expect(screen.getByText('This field is required')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <ValidationError 
        error="Test error" 
        touched={true} 
        className="custom-class" 
      />
    );
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(
      <ValidationError error="Test error" touched={true} />
    );
    
    const errorElement = screen.getByRole('alert');
    expect(errorElement).toHaveAttribute('aria-live', 'polite');
  });

  it('includes error icon', () => {
    render(
      <ValidationError error="Test error" touched={true} />
    );
    
    const icon = screen.getByRole('alert').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});