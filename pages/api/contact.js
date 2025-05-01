import { check, validationResult } from 'express-validator';
import nodemailer from 'nodemailer';

// Validation schema for the contact form
const contactFormValidationRules = [
    check('name').notEmpty().trim().escape().withMessage('Name is required'),
    check('email').isEmail().normalizeEmail().withMessage('Invalid email address'),
    check('message').notEmpty().trim().escape().withMessage('Message is required'),
];

/**
 * Handles the contact form submission.
 */
const contactHandler = async (req, res) => {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' }); // Only allow POST
    }

    // 1. Validate the input
    await Promise.all(contactFormValidationRules.map(rule => rule.run(req))); // Run all validations
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    // 2. Extract data from the request
    const { name, email, message } = req.body;

    // 3. Process the data (send email, save to database, etc.)
    try {
        // console.log('Received contact form submission:');
        // console.log('Name:', name);
        // console.log('Email:', email);
        // console.log('Message:', message);

        // Simulate sending an email (replace with actual email sending logic)
        // Example using a library like Nodemailer:
        // const nodemailer = require('nodemailer');
        // const transporter = nodemailer.createTransport({ /* ... */ });
        // await transporter.sendMail({ /* ... */ });

         // 3.1. Configure Nodemailer
         const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            service: 'gmail', // e.g., 'gmail', 'Outlook'
            auth: {
                user: process.env.EMAIL_USER, // Replace with your email address
                pass: process.env.EMAIL_PASS, // Replace with your email password or an app password
            },
        });

        // 3.2. Define the email message
        const mailOptions = {
            from: `${email}`, // Replace with your email address
            to: process.env.EMAIL_USER, // Replace with the recipient email address
            subject: 'New Contact Form Submission On SEO keyword Miner.',
            text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
            // html: `<p>Name: ${name}</p><p>Email: ${email}</p><p>Message: ${message}</p>`, // You can also use HTML
        };

        // 3.3. Send the email
        await transporter.sendMail(mailOptions);

        // 4. Send a success response
        res.status(200).json({
            message: 'Thank you for your message! We will get back to you shortly.',
            data: { name, email, message },
        });
    } catch (error) {
        // 5. Handle errors during processing
        console.error('Error processing contact form:', error);
        res.status(500).json({ error: 'Internal server error', message: error.message || 'Failed to process your message.' }); //Include a more specific error message
    }
};

export default contactHandler;
