import { z } from 'zod';

// Base validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

export const phoneSchema = z
  .string()
  .optional()
  .refine((val) => !val || /^[\+]?[1-9][\d]{0,15}$/.test(val), {
    message: 'Please enter a valid phone number',
  });

export const nameSchema = z
  .string()
  .min(1, 'This field is required')
  .max(50, 'Name must be less than 50 characters')
  .regex(/^[a-zA-Z\s\-'\.]+$/, 'Name can only contain letters, spaces, hyphens, apostrophes, and periods');

// User registration schema
export const registrationSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  phoneNumber: phoneSchema,
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: 'You must agree to the terms and conditions',
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

// User login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

// Profile update schema
export const profileUpdateSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  phoneNumber: phoneSchema,
  locationAddress: z.string().optional(),
  locationLatitude: z.number().min(-90).max(90).optional(),
  locationLongitude: z.number().min(-180).max(180).optional(),
});

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'New passwords do not match',
  path: ['confirmNewPassword'],
});

// Review schema
export const reviewSchema = z.object({
  supplierId: z.string().min(1, 'Supplier ID is required'),
  rating: z.number().min(1, 'Rating is required').max(5, 'Rating must be between 1 and 5'),
  title: z.string().min(1, 'Review title is required').max(100, 'Title must be less than 100 characters'),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(1000, 'Comment must be less than 1000 characters'),
  orderId: z.string().optional(),
  wouldRecommend: z.boolean().optional(),
});

// Order schema
export const orderSchema = z.object({
  supplierId: z.string().min(1, 'Supplier ID is required'),
  items: z.array(z.object({
    productId: z.string().min(1, 'Product ID is required'),
    productName: z.string().min(1, 'Product name is required'),
    quantity: z.number().min(1, 'Quantity must be at least 1'),
    price: z.number().min(0, 'Price must be positive'),
  })).min(1, 'At least one item is required'),
  totalAmount: z.number().min(0, 'Total amount must be positive'),
  deliveryAddress: z.string().optional(),
  deliveryNotes: z.string().max(500, 'Delivery notes must be less than 500 characters').optional(),
  paymentMethod: z.enum(['credit_card', 'debit_card', 'paypal', 'cash'], {
    errorMap: () => ({ message: 'Please select a valid payment method' }),
  }),
});

// PAWS transfer schema
export const pawsTransferSchema = z.object({
  recipientEmail: emailSchema,
  amount: z.number()
    .min(10, 'Minimum transfer amount is 10 PAWS')
    .max(10000, 'Maximum transfer amount is 10,000 PAWS'),
  description: z.string()
    .max(200, 'Description must be less than 200 characters')
    .optional(),
});

// Search schema
export const searchSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.number().min(0).optional(),
  maxPrice: z.number().min(0).optional(),
  radius: z.number().min(1).max(100).optional(),
  sortBy: z.enum([
    'recommended',
    'distance',
    'rating',
    'price_low',
    'price_high',
    'paws_rewards',
    'newest',
    'oldest'
  ]).optional(),
  services: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

// Validation helper functions
export const validateField = (schema, value) => {
  try {
    schema.parse(value);
    return { isValid: true, error: null };
  } catch (error) {
    return {
      isValid: false,
      error: error.errors?.[0]?.message || 'Invalid input',
    };
  }
};

export const validateForm = (schema, data) => {
  try {
    const validatedData = schema.parse(data);
    return { isValid: true, data: validatedData, errors: {} };
  } catch (error) {
    const errors = {};
    error.errors?.forEach((err) => {
      const field = err.path.join('.');
      errors[field] = err.message;
    });
    
    return {
      isValid: false,
      data: null,
      errors,
    };
  }
};

// Custom validation functions
export const isValidEmail = (email) => {
  const result = validateField(emailSchema, email);
  return result.isValid;
};

export const isStrongPassword = (password) => {
  const result = validateField(passwordSchema, password);
  return result.isValid;
};

export const isValidPhoneNumber = (phone) => {
  if (!phone) return true; // Optional field
  const result = validateField(phoneSchema, phone);
  return result.isValid;
};

export const isValidCoordinates = (latitude, longitude) => {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
};

export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  return input
    .trim()
    .replace(/[<>\"']/g, '') // Remove potentially dangerous characters
    .substring(0, 1000); // Limit length
};

export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  // Format as (XXX) XXX-XXXX for US numbers
  if (digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  }
  
  return phone;
};

export const formatCurrency = (amount) => {
  if (typeof amount !== 'number') return '$0.00';
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

export const formatPawsAmount = (amount) => {
  if (typeof amount !== 'number') return '0';
  
  return amount.toLocaleString();
};

// Form field validation helpers for React Hook Form
export const getFieldValidation = (schema) => {
  return {
    validate: (value) => {
      const result = validateField(schema, value);
      return result.isValid || result.error;
    },
  };
};

export const getFormValidation = (schema) => {
  return {
    mode: 'onChange',
    resolver: async (data) => {
      const result = validateForm(schema, data);
      return {
        values: result.isValid ? result.data : {},
        errors: result.errors,
      };
    },
  };
};