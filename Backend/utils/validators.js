import Joi from 'joi';

// --- Validation Schemas ---

export const loginSchema = Joi.object({
    // Identifier can be an email or a registration number (RegNo)
    identifier: Joi.string()
        .required()
        .messages({
            'any.required': 'Identifier (Email or RegNo) is required.'
        }),
    password: Joi.string()
        .min(6) // Enforce minimum length for security
        .required()
        .messages({
            'string.min': 'Password must be at least 6 characters long.',
            'any.required': 'Password is required.',
        }),
});

export const registerSchema = Joi.object({
    // Explicitly define allowed roles
    role: Joi.string()
        .valid('Admin', 'Lecture', 'Student')
        .required(),
    password: Joi.string().min(6).required(),
    email: Joi.string().email().optional(), // Student email is auto-generated
    fname: Joi.string().optional(),
    lname: Joi.string().optional(),
    level: Joi.number().integer().min(1).max(3).optional(),
    image: Joi.string().optional(),
    
    // Conditional requirements: regNo is required IF role is Student
    regNo: Joi.string()
        .when('role', { 
            is: 'Student', 
            then: Joi.required().messages({'any.required': 'Registration number (regNo) is required for Students.'}) 
        })
        .optional(),
});


// --- Generic Validation Middleware ---

export const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, {
        abortEarly: false, // Return all errors instead of just the first one
        allowUnknown: true, // Allows extra fields that aren't defined in the schema
    });

    if (error) {
        // Format Joi error details into an array of user-friendly messages
        const errorMessages = error.details.map((detail) => 
            detail.message.replace(/['"]+/g, '') // Removes surrounding quotes
        );
        return res.status(400).json({
            message: 'Validation failed',
            errors: errorMessages,
        });
    }
    next();
};