import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Input from './Input';

describe('Input Component', () => {
  it('renders correctly with default props', () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText('Enter text');
    
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    expect(input).not.toBeDisabled();
  });

  it('renders with label', () => {
    render(<Input label="Username" placeholder="Enter username" />);
    
    const label = screen.getByText('Username');
    expect(label).toBeInTheDocument();
    expect(label).toHaveClass('text-gray-700');
    
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toBeInTheDocument();
  });

  it('renders with error state', () => {
    render(<Input error="This field is required" placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    expect(input).toHaveClass('border-red-500');
    expect(input).toHaveClass('bg-red-50');
    expect(input).toHaveAttribute('aria-invalid', 'true');
    
    const errorMessage = screen.getByText('This field is required');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass('text-red-600');
    expect(errorMessage).toHaveAttribute('role', 'alert');
  });

  it('renders with success state', () => {
    render(
      <Input 
        isValid={true} 
        successMessage="Username is available" 
        placeholder="Enter username" 
      />
    );
    
    const input = screen.getByPlaceholderText('Enter username');
    expect(input).toHaveClass('border-green-500');
    expect(input).toHaveClass('bg-green-50');
    
    const successMessage = screen.getByText('Username is available');
    expect(successMessage).toBeInTheDocument();
    expect(successMessage).toHaveClass('text-green-600');
  });

  it('renders with helper text', () => {
    render(
      <Input 
        helperText="Must be at least 8 characters" 
        placeholder="Enter password" 
      />
    );
    
    const helperText = screen.getByText('Must be at least 8 characters');
    expect(helperText).toBeInTheDocument();
    expect(helperText).toHaveClass('text-gray-500');
  });

  it('renders with different input types', () => {
    const { rerender } = render(<Input type="email" placeholder="Enter email" />);
    let input = screen.getByPlaceholderText('Enter email');
    expect(input).toHaveAttribute('type', 'email');
    
    rerender(<Input type="password" placeholder="Enter password" />);
    input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');
    
    rerender(<Input type="tel" placeholder="Enter phone" />);
    input = screen.getByPlaceholderText('Enter phone');
    expect(input).toHaveAttribute('type', 'tel');
  });

  it('renders in disabled state', () => {
    render(<Input disabled placeholder="Disabled input" />);
    const input = screen.getByPlaceholderText('Disabled input');
    
    expect(input).toBeDisabled();
    expect(input).toHaveClass('opacity-60');
    expect(input).toHaveClass('cursor-not-allowed');
    expect(input).toHaveClass('bg-gray-100');
  });

  it('renders with full width', () => {
    render(<Input fullWidth placeholder="Full width input" />);
    
    const inputContainer = screen.getByPlaceholderText('Full width input').closest('div')?.parentElement;
    expect(inputContainer).toHaveClass('w-full');
    
    const input = screen.getByPlaceholderText('Full width input');
    expect(input).toHaveClass('w-full');
  });

  it('renders with required indicator', () => {
    render(<Input label="Username" required placeholder="Enter username" />);
    
    const requiredIndicator = screen.getByText('*');
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass('text-red-500');
  });

  it('renders with left icon', () => {
    render(
      <Input 
        leftIcon={<span data-testid="left-icon">🔍</span>}
        placeholder="Search"
      />
    );
    
    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveClass('pl-10');
  });

  it('renders with right icon', () => {
    render(
      <Input 
        rightIcon={<span data-testid="right-icon">✓</span>}
        placeholder="Verified input"
      />
    );
    
    expect(screen.getByTestId('right-icon')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('Verified input');
    expect(input).toHaveClass('pr-10');
  });

  it('changes label color on focus', async () => {
    render(<Input label="Username" placeholder="Enter username" />);
    
    const input = screen.getByPlaceholderText('Enter username');
    const label = screen.getByText('Username');
    
    expect(label).not.toHaveClass('text-purdue-gold');
    
    fireEvent.focus(input);
    expect(label).toHaveClass('text-purdue-gold');
    
    fireEvent.blur(input);
    expect(label).not.toHaveClass('text-purdue-gold');
  });

  it('calls onChange handler when value changes', async () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} placeholder="Enter text" />);
    
    const input = screen.getByPlaceholderText('Enter text');
    await userEvent.type(input, 'Hello');
    
    expect(handleChange).toHaveBeenCalledTimes(5); // Once for each character
  });

  it('does not call onChange when disabled', async () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} disabled placeholder="Disabled input" />);
    
    const input = screen.getByPlaceholderText('Disabled input');
    await userEvent.type(input, 'Hello');
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" placeholder="Custom input" />);
    const input = screen.getByPlaceholderText('Custom input');
    
    expect(input).toHaveClass('custom-class');
  });

  it('generates unique IDs for inputs without IDs', () => {
    render(
      <>
        <Input label="First" placeholder="First input" />
        <Input label="Second" placeholder="Second input" />
      </>
    );
    
    const firstInput = screen.getByPlaceholderText('First input');
    const secondInput = screen.getByPlaceholderText('Second input');
    
    const firstId = firstInput.getAttribute('id');
    const secondId = secondInput.getAttribute('id');
    
    expect(firstId).not.toBe(secondId);
    expect(firstId).toMatch(/input-[a-z0-9]+/);
    expect(secondId).toMatch(/input-[a-z0-9]+/);
  });
});
  it(
'renders as textarea when as="textarea" prop is provided', () => {
    render(<Input label="Comments" as="textarea" placeholder="Enter comments" />);
    
    const textarea = screen.getByPlaceholderText('Enter comments');
    expect(textarea.tagName.toLowerCase()).toBe('textarea');
  });

  it('applies rows attribute to textarea', () => {
    render(<Input label="Comments" as="textarea" rows={5} placeholder="Enter comments" />);
    
    const textarea = screen.getByPlaceholderText('Enter comments');
    expect(textarea).toHaveAttribute('rows', '5');
  });

  it('applies the same styling to textarea as to input', () => {
    render(<Input label="Comments" as="textarea" className="test-class" placeholder="Enter comments" />);
    
    const textarea = screen.getByPlaceholderText('Enter comments');
    expect(textarea).toHaveClass('test-class');
    expect(textarea).toHaveClass('rounded-md');
    expect(textarea).toHaveClass('border');
  });

  it('handles focus and blur events for textarea', () => {
    render(<Input label="Comments" as="textarea" placeholder="Enter comments" />);
    
    const textarea = screen.getByPlaceholderText('Enter comments');
    const label = screen.getByText('Comments');
    
    // Initially, label should not have the focused class
    expect(label).not.toHaveClass('text-purdue-gold');
    
    // Focus the textarea
    fireEvent.focus(textarea);
    expect(label).toHaveClass('text-purdue-gold');
    
    // Blur the textarea
    fireEvent.blur(textarea);
    expect(label).not.toHaveClass('text-purdue-gold');
  });