/**
 * Utility functions for accessibility
 */

/**
 * Checks if the contrast ratio between two colors meets WCAG 2.1 AA standards
 * @param foreground Foreground color in hex format (e.g., "#ffffff")
 * @param background Background color in hex format (e.g., "#000000")
 * @returns Whether the contrast ratio meets WCAG 2.1 AA standards (4.5:1 for normal text, 3:1 for large text)
 */
export const hasAdequateContrast = (
  foreground: string,
  background: string,
  isLargeText: boolean = false
): boolean => {
  // Convert hex to RGB
  const hexToRgb = (hex: string): number[] => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
  };

  // Calculate relative luminance
  const calculateLuminance = (rgb: number[]): number => {
    const [r, g, b] = rgb.map(val => {
      val = val / 255;
      return val <= 0.03928
        ? val / 12.92
        : Math.pow((val + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const rgb1 = hexToRgb(foreground);
  const rgb2 = hexToRgb(background);
  const l1 = calculateLuminance(rgb1);
  const l2 = calculateLuminance(rgb2);

  // Calculate contrast ratio
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

  // Check against WCAG 2.1 AA standards
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
};

/**
 * Creates a visually hidden element that is still accessible to screen readers
 * @returns CSS class string for visually hidden elements
 */
export const visuallyHidden = (): string => {
  return 'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0';
};

/**
 * Generates a unique ID for accessibility attributes
 * @param prefix Optional prefix for the ID
 * @returns A unique ID string
 */
export const generateAccessibleId = (prefix: string = 'a11y'): string => {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Checks if a string is a valid ARIA role
 * @param role The ARIA role to check
 * @returns Whether the role is valid
 */
export const isValidAriaRole = (role: string): boolean => {
  const validRoles = [
    'alert', 'alertdialog', 'application', 'article', 'banner', 'button',
    'cell', 'checkbox', 'columnheader', 'combobox', 'complementary',
    'contentinfo', 'definition', 'dialog', 'directory', 'document',
    'feed', 'figure', 'form', 'grid', 'gridcell', 'group', 'heading',
    'img', 'link', 'list', 'listbox', 'listitem', 'log', 'main',
    'marquee', 'math', 'menu', 'menubar', 'menuitem', 'menuitemcheckbox',
    'menuitemradio', 'navigation', 'none', 'note', 'option', 'presentation',
    'progressbar', 'radio', 'radiogroup', 'region', 'row', 'rowgroup',
    'rowheader', 'scrollbar', 'search', 'searchbox', 'separator', 'slider',
    'spinbutton', 'status', 'switch', 'tab', 'table', 'tablist', 'tabpanel',
    'term', 'textbox', 'timer', 'toolbar', 'tooltip', 'tree', 'treegrid',
    'treeitem'
  ];
  
  return validRoles.includes(role.toLowerCase());
};

/**
 * Checks if the keyboard event is an activation event (Enter or Space)
 * @param event Keyboard event
 * @returns Whether the event is an activation event
 */
export const isActivationEvent = (event: React.KeyboardEvent): boolean => {
  return event.key === 'Enter' || event.key === ' ';
};

/**
 * Handles keyboard activation for non-button elements that should behave like buttons
 * @param event Keyboard event
 * @param callback Function to call when activated
 */
export const handleKeyboardActivation = (
  event: React.KeyboardEvent,
  callback: () => void
): void => {
  if (isActivationEvent(event)) {
    event.preventDefault();
    callback();
  }
};