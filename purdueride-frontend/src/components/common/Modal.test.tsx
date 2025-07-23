import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Modal from './Modal';

// Mock createPortal to make it work with testing-library
vi.mock('react-dom', async () => {
  const actual = await vi.importActual('react-dom');
  return {
    ...actual,
    createPortal: (node: React.ReactNode) => node,
  };
});

describe('Modal Component', () => {
  // Reset mocks before each test
  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('renders nothing when closed', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        Modal content
      </Modal>
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders content when open', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Modal content
      </Modal>
    );
    
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('renders with title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        Modal content
      </Modal>
    );
    
    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByRole('heading')).toHaveTextContent('Test Modal');
  });

  it('calls onClose when close button is clicked', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        Modal content
      </Modal>
    );
    
    const closeButton = screen.getByLabelText('Close modal');
    await userEvent.click(closeButton);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked and closeOnOutsideClick is true', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOutsideClick={true}>
        Modal content
      </Modal>
    );
    
    // Click the backdrop (parent div with dialog role)
    const backdrop = screen.getByRole('dialog');
    await userEvent.click(backdrop);
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when backdrop is clicked and closeOnOutsideClick is false', async () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnOutsideClick={false}>
        Modal content
      </Modal>
    );
    
    // Click the backdrop (parent div with dialog role)
    const backdrop = screen.getByRole('dialog');
    await userEvent.click(backdrop);
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('calls onClose when escape key is pressed and closeOnEscape is true', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={true}>
        Modal content
      </Modal>
    );
    
    // Press escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when escape key is pressed and closeOnEscape is false', () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} closeOnEscape={false}>
        Modal content
      </Modal>
    );
    
    // Press escape key
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(handleClose).not.toHaveBeenCalled();
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <Modal isOpen={true} onClose={() => {}} size="sm">
        Modal content
      </Modal>
    );
    
    let modalContent = screen.getByRole('document');
    expect(modalContent).toHaveClass('max-w-sm');
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} size="md">
        Modal content
      </Modal>
    );
    modalContent = screen.getByRole('document');
    expect(modalContent).toHaveClass('max-w-md');
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        Modal content
      </Modal>
    );
    modalContent = screen.getByRole('document');
    expect(modalContent).toHaveClass('max-w-lg');
    
    rerender(
      <Modal isOpen={true} onClose={() => {}} size="xl">
        Modal content
      </Modal>
    );
    modalContent = screen.getByRole('document');
    expect(modalContent).toHaveClass('max-w-xl');
  });

  it('renders with footer when provided', () => {
    render(
      <Modal 
        isOpen={true} 
        onClose={() => {}} 
        footer={<button>Save</button>}
      >
        Modal content
      </Modal>
    );
    
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
  });

  it('does not show close button when showCloseButton is false', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} showCloseButton={false}>
        Modal content
      </Modal>
    );
    
    expect(screen.queryByLabelText('Close modal')).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} className="custom-class">
        Modal content
      </Modal>
    );
    
    const modalContent = screen.getByRole('document');
    expect(modalContent).toHaveClass('custom-class');
  });

  it('has proper accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Modal">
        Modal content
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'modal-title');
    
    const title = screen.getByText('Accessible Modal');
    expect(title).toHaveAttribute('id', 'modal-title');
  });
});