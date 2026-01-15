import { z } from 'zod';

// --- Validation Schemas ---

/**
 * @Schema: loginSchema
 * Validates the input for user login.
 */
export const loginSchema = z.object({
  // Identifier can be an email or a registration number (RegNo)
  identifier: z.string({
    required_error: 'Identifier (Email or RegNo) is required.',
  }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters long.' })
    .catch(''), // .catch('') is a common Zod pattern to ensure min() check runs even if password is undefined/null
});

/**
 * @Schema: registerSchema
 * Validates the input for user registration.
 */
export const registerSchema = z
  .object({
    // Explicitly define allowed roles
    role: z.enum(['Admin', 'Lecture', 'Student']),

    password: z.string().min(6),

    // Student email is auto-generated, so it's optional here.
    email: z.string().email().optional(),

    fname: z.string().optional(),
    lname: z.string().optional(),

    // level: 1, 2, or 3
    level: z.number().int().min(1).max(3).optional(),

    image: z.string().optional(),

    // Conditional requirements: regNo is required IF role is 'Student'
    regNo: z.string().optional(),
  })
  // Refine the schema to enforce conditional validation for 'regNo'
  .superRefine((data, ctx) => {
    if (data.role === 'Student' && !data.regNo) {
      // Add a custom error if the role is 'Student' but 'regNo' is missing
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Registration number (regNo) is required for Students.',
        path: ['regNo'],
      });
    }
  });

// --- Generic Validation Middleware ---

/**
 * @Middleware: validate
 * Generic middleware to validate request body against a Zod schema.
 */
export const validate = (schema) => (req, res, next) => {
  // Note: Zod's parse and safeParse methods throw/return structured errors.
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Format Zod error details into an array of user-friendly messages
    const errorMessages = result.error.errors.map((err) => {
      // Construct a message based on path and Zod error message
      const path = err.path.join('.');
      // Use the path only if it's not empty, otherwise just the message
      return path ? `${path}: ${err.message}` : err.message;
    });

    return res.status(400).json({
      message: 'Validation failed',
      errors: errorMessages,
    });
  }

  // If validation succeeds, req.body is replaced with the parsed data,
  // which is useful for removing undefined or disallowed properties (though 'allowUnknown' isn't needed here).
  req.body = result.data;

  next();
};
