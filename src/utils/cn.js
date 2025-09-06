/**
 * Class Name Utility
 * Combines class names with proper handling of conditionals and deduplication
 */

import { clsx } from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}