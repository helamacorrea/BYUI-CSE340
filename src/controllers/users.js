import bcrypt from 'bcrypt';
import { createUser } from '../models/users.js';
import { body, validationResult } from 'express-validator';
import db from '../models/db.js';

const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Organization name is required')
        .isLength({ min: 3, max: 50 })
        .withMessage('Name must be between 3 and 50 characters'),
    body('email')
        .normalizeEmail()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Please provide a valid email address')
        .bail()
        .custom(async (email) => {
            const result = await db.query(
                'SELECT 1 FROM users WHERE email = $1 LIMIT 1',
                [email]
            );

            if (result.rows.length > 0) {
                throw new Error('Email is already registered');
            }

            return true;
        }),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8, max: 30 })
        .withMessage('Password must be between 8 - 30 characters'),
];


const showUserRegistrationForm = async (req, res) => {
    const title = "Register";

    res.render('register', {title});
}

const processUserRegistrationForm = async (req, res) => {
    //input validation
    const results = validationResult(req);
    if (!results.isEmpty()) {
        results.array().forEach((error) => {
            req.flash('error', error.msg);
        });
        return res.redirect('/register');
    }    

    const saltRounds = 10;
    console.log(req.body);
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user_id = await createUser(name, email, passwordHash);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/');
}

export { showUserRegistrationForm, processUserRegistrationForm, registerValidation }
