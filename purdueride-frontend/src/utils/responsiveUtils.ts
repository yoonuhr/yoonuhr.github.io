/**
 * Utility functions for responsive design
 */

/**
 * Breakpoints used in the application
 * These should match the Tailwind CSS breakpoints
 */
export const breakpoints = {
  sm: 640,  // Small devices (phones, 640px and up)
  md: 768,  // Medium devices (tablets, 768px and up)
  lg: 1024, // Large devices (desktops, 1024px and up)
  xl: 1280, // Extra large devices (large desktops, 1280px and up)
  '2xl': 1536, // 2X Extra large devices (larger desktops, 1536px and up)
};

/**
 * Hook to detect if the current viewport is mobile
 * @returns {boolean} True if the viewport is mobile
 */
export const isMobileViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < breakpoints.md;
};

/**
 * Hook to detect if the current viewport is tablet
 * @returns {boolean} True if the viewport is tablet
 */
export const isTabletViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.md && window.innerWidth < breakpoints.lg;
};

/**
 * Hook to detect if the current viewport is desktop
 * @returns {boolean} True if the viewport is desktop
 */
export const isDesktopViewport = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints.lg;
};

/**
 * Ensures that touch targets are at least 44x44 pixels
 * This is a WCAG 2.1 AA requirement
 * @param size Size in pixels
 * @returns Size that is at least 44 pixels
 */
export const ensureMinimumTouchTarget = (size: number): number => {
  return Math.max(size, 44);
};

/**
 * Calculates responsive font size based on viewport width
 * @param baseSize Base font size in pixels
 * @param minSize Minimum font size in pixels
 * @param maxSize Maximum font size in pixels
 * @returns Responsive font size
 */
export const getResponsiveFontSize = (
  baseSize: number,
  minSize: number = 14,
  maxSize: number = 24
): string => {
  // Calculate a size between minSize and maxSize based on viewport width
  const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 1024;
  const size = Math.max(
    minSize,
    Math.min(
      maxSize,
      baseSize * (viewportWidth / 1024)
    )
  );
  
  return `${size}px`;
};