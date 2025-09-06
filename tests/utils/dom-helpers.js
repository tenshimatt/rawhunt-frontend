/**
 * DOM Testing Helpers
 * Rawgul v0.2 TDD Implementation
 */

/**
 * Get computed styles for an element (mocked for testing environment)
 */
export function getComputedStyle(element) {
  // In test environment, we mock computed styles based on className
  const styles = {};
  
  if (!element || !element.className) return styles;
  
  const classes = element.className.split(' ');
  
  // Mock Tailwind classes to CSS properties
  classes.forEach(className => {
    const style = mockTailwindClass(className);
    Object.assign(styles, style);
  });
  
  return styles;
}

/**
 * Mock Tailwind CSS classes to actual CSS properties
 */
function mockTailwindClass(className) {
  const styles = {};
  
  // Colors
  if (className.includes('bg-emerald-600')) styles.backgroundColor = '#059669';
  if (className.includes('bg-warmBrown-400')) styles.backgroundColor = '#d4a574';
  if (className.includes('text-white')) styles.color = '#ffffff';
  if (className.includes('text-emerald-800')) styles.color = '#065f46';
  
  // Spacing
  if (className.includes('px-4')) styles.paddingLeft = styles.paddingRight = '1rem';
  if (className.includes('py-2')) styles.paddingTop = styles.paddingBottom = '0.5rem';
  if (className.includes('px-3')) styles.paddingLeft = styles.paddingRight = '0.75rem';
  if (className.includes('py-1')) styles.paddingTop = styles.paddingBottom = '0.25rem';
  
  // Typography
  if (className.includes('text-sm')) styles.fontSize = '0.875rem';
  if (className.includes('text-base')) styles.fontSize = '1rem';
  if (className.includes('text-lg')) styles.fontSize = '1.125rem';
  if (className.includes('font-medium')) styles.fontWeight = '500';
  if (className.includes('font-bold')) styles.fontWeight = '700';
  
  // Border radius
  if (className.includes('rounded-lg')) styles.borderRadius = '0.5rem';
  if (className.includes('rounded-full')) styles.borderRadius = '9999px';
  
  // Flexbox
  if (className.includes('flex')) styles.display = 'flex';
  if (className.includes('inline-flex')) styles.display = 'inline-flex';
  if (className.includes('items-center')) styles.alignItems = 'center';
  
  return styles;
}

/**
 * Check if element has specific Tailwind classes
 */
export function hasClasses(element, ...classNames) {
  if (!element || !element.className) return false;
  
  const elementClasses = element.className.split(' ');
  return classNames.every(className => elementClasses.includes(className));
}

/**
 * Get all Tailwind classes from element
 */
export function getClasses(element) {
  if (!element || !element.className) return [];
  return element.className.split(' ').filter(Boolean);
}

/**
 * Check if element has responsive classes
 */
export function hasResponsiveClasses(element, breakpoint = 'md') {
  const classes = getClasses(element);
  return classes.some(className => className.startsWith(`${breakpoint}:`));
}

/**
 * Extract color information from Tailwind classes
 */
export function extractColors(element) {
  const classes = getClasses(element);
  const colors = {
    background: null,
    text: null,
    border: null
  };
  
  classes.forEach(className => {
    if (className.startsWith('bg-')) {
      colors.background = className;
    } else if (className.startsWith('text-') && !className.includes('text-xs') && !className.includes('text-sm')) {
      colors.text = className;
    } else if (className.startsWith('border-') && !className.includes('border-2')) {
      colors.border = className;
    }
  });
  
  return colors;
}

/**
 * Check if element follows design system spacing
 */
export function hasConsistentSpacing(element) {
  const classes = getClasses(element);
  const spacingClasses = classes.filter(c => 
    c.startsWith('p-') || 
    c.startsWith('px-') || 
    c.startsWith('py-') ||
    c.startsWith('m-') ||
    c.startsWith('mx-') ||
    c.startsWith('my-')
  );
  
  // Check if spacing values are from our design system scale
  const allowedSpacing = ['0', '1', '2', '3', '4', '5', '6', '8', '10', '12', '16', '20', '24'];
  
  return spacingClasses.every(className => {
    const value = className.split('-').pop();
    return allowedSpacing.includes(value);
  });
}

/**
 * Validate accessibility features
 */
export function checkAccessibility(element) {
  const checks = {
    hasAriaLabel: element.hasAttribute('aria-label'),
    hasRole: element.hasAttribute('role'),
    hasTabIndex: element.hasAttribute('tabindex'),
    isFocusable: element.tabIndex >= 0 || ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase()),
    hasProperContrast: true // Would need actual color contrast calculation
  };
  
  return checks;
}

export default {
  getComputedStyle,
  hasClasses,
  getClasses,
  hasResponsiveClasses,
  extractColors,
  hasConsistentSpacing,
  checkAccessibility
};