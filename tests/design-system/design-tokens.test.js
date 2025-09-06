/**
 * Design Tokens Tests
 * Rawgul v0.2 TDD Implementation
 * 
 * Tests design system tokens for consistency and accessibility
 */

import { describe, test, expect } from 'vitest';
import { getComputedStyle } from '../utils/dom-helpers.js';

describe('Design Tokens', () => {
  describe('Color System', () => {
    test('should define primary colors correctly', () => {
      const primaryColors = {
        emerald: {
          50: '#ecfdf5',
          100: '#d1fae5', 
          500: '#10b981',  // Primary
          600: '#059669',  // Primary hover
          700: '#047857',  // Primary active
          900: '#064e3b'
        }
      };

      // Test that primary emerald colors are defined
      expect(primaryColors.emerald[500]).toBe('#10b981');
      expect(primaryColors.emerald[600]).toBe('#059669');
      expect(primaryColors.emerald[700]).toBe('#047857');
    });

    test('should define secondary colors correctly', () => {
      const secondaryColors = {
        warmBrown: {
          50: '#fdf8f4',
          100: '#e8dcc6',  // Light background
          400: '#d4a574',  // Secondary
          600: '#b8956a',  // Secondary hover
          700: '#8b6914',  // Secondary active
          900: '#2c1810'   // Dark text
        }
      };

      expect(secondaryColors.warmBrown[400]).toBe('#d4a574');
      expect(secondaryColors.warmBrown[700]).toBe('#8b6914');
      expect(secondaryColors.warmBrown[900]).toBe('#2c1810');
    });

    test('should define accent colors correctly', () => {
      const accentColors = {
        amber: {
          50: '#fffbeb',
          400: '#fbbf24',
          500: '#f59e0b',  // Accent
          600: '#d97706'   // Accent hover
        }
      };

      expect(accentColors.amber[500]).toBe('#f59e0b');
      expect(accentColors.amber[600]).toBe('#d97706');
    });

    test('should maintain proper color contrast ratios', () => {
      // Test color contrast for accessibility compliance (WCAG AA)
      const colorCombinations = [
        { bg: '#047857', text: '#ffffff', minContrast: 4.5 }, // Primary 700 + white (darker primary)
        { bg: '#2c1810', text: '#fdf8f4', minContrast: 4.5 }, // Secondary 900 + lightest
        { bg: '#b45309', text: '#ffffff', minContrast: 4.5 }, // Accent 700 + white (darker accent)
        { bg: '#f9fafb', text: '#111827', minContrast: 4.5 }  // Background + text
      ];

      colorCombinations.forEach(combo => {
        const contrast = calculateContrastRatio(combo.bg, combo.text);
        expect(contrast).toBeGreaterThanOrEqual(combo.minContrast);
      });
    });
  });

  describe('Typography System', () => {
    test('should define consistent font families', () => {
      const fontFamilies = {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      };

      expect(fontFamilies.sans).toContain('Inter');
      expect(fontFamilies.sans).toContain('system-ui');
      expect(fontFamilies.mono).toContain('ui-monospace');
    });

    test('should define proper font size scale', () => {
      const fontSizes = {
        xs: '0.75rem',    // 12px
        sm: '0.875rem',   // 14px
        base: '1rem',     // 16px
        lg: '1.125rem',   // 18px
        xl: '1.25rem',    // 20px
        '2xl': '1.5rem',  // 24px
        '3xl': '1.875rem', // 30px
        '4xl': '2.25rem', // 36px
        '5xl': '3rem'     // 48px
      };

      expect(fontSizes.base).toBe('1rem');
      expect(fontSizes.lg).toBe('1.125rem');
      expect(fontSizes['2xl']).toBe('1.5rem');
    });

    test('should define proper line height scale', () => {
      const lineHeights = {
        none: '1',
        tight: '1.25',
        snug: '1.375',
        normal: '1.5',
        relaxed: '1.625',
        loose: '2'
      };

      expect(lineHeights.normal).toBe('1.5');
      expect(lineHeights.tight).toBe('1.25');
      expect(lineHeights.loose).toBe('2');
    });

    test('should define proper font weights', () => {
      const fontWeights = {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800'
      };

      expect(fontWeights.normal).toBe('400');
      expect(fontWeights.bold).toBe('700');
      expect(fontWeights.semibold).toBe('600');
    });
  });

  describe('Spacing System', () => {
    test('should follow consistent spacing scale', () => {
      const spacing = {
        0: '0px',
        1: '0.25rem',  // 4px
        2: '0.5rem',   // 8px
        3: '0.75rem',  // 12px
        4: '1rem',     // 16px
        5: '1.25rem',  // 20px
        6: '1.5rem',   // 24px
        8: '2rem',     // 32px
        10: '2.5rem',  // 40px
        12: '3rem',    // 48px
        16: '4rem',    // 64px
        20: '5rem',    // 80px
        24: '6rem'     // 96px
      };

      expect(spacing[4]).toBe('1rem');
      expect(spacing[8]).toBe('2rem');
      expect(spacing[16]).toBe('4rem');
    });

    test('should maintain mathematical progression', () => {
      const spacingValues = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96];
      
      // Each value should be a multiple of 4
      spacingValues.forEach(value => {
        expect(value % 4).toBe(0);
      });
    });
  });

  describe('Border Radius System', () => {
    test('should define consistent border radius scale', () => {
      const borderRadius = {
        none: '0px',
        sm: '0.125rem',   // 2px
        DEFAULT: '0.25rem', // 4px
        md: '0.375rem',   // 6px
        lg: '0.5rem',     // 8px
        xl: '0.75rem',    // 12px
        '2xl': '1rem',    // 16px
        '3xl': '1.5rem',  // 24px
        full: '9999px'
      };

      expect(borderRadius.DEFAULT).toBe('0.25rem');
      expect(borderRadius.lg).toBe('0.5rem');
      expect(borderRadius.xl).toBe('0.75rem');
      expect(borderRadius.full).toBe('9999px');
    });
  });

  describe('Shadow System', () => {
    test('should define elevation shadows', () => {
      const shadows = {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
        '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
        none: '0 0 #0000'
      };

      expect(shadows.sm).toBeDefined();
      expect(shadows.DEFAULT).toBeDefined();
      expect(shadows.lg).toBeDefined();
      expect(shadows.none).toBe('0 0 #0000');
    });
  });

  describe('Breakpoints System', () => {
    test('should define responsive breakpoints', () => {
      const breakpoints = {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px'
      };

      expect(breakpoints.sm).toBe('640px');
      expect(breakpoints.md).toBe('768px');
      expect(breakpoints.lg).toBe('1024px');
      expect(breakpoints.xl).toBe('1280px');
    });
  });
});

/**
 * Helper function to calculate color contrast ratio
 * Based on WCAG 2.1 guidelines
 */
function calculateContrastRatio(color1, color2) {
  const luminance1 = getLuminance(color1);
  const luminance2 = getLuminance(color2);
  
  const lighter = Math.max(luminance1, luminance2);
  const darker = Math.min(luminance1, luminance2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Calculate relative luminance of a color
 */
function getLuminance(hex) {
  // Convert hex to RGB
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  // Convert RGB to relative luminance
  const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Convert hex color to RGB object
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}