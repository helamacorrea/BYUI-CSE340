import bcrypt from 'bcrypt';
import { createUser, authenticateUser } from '../models/users.js';
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
        .isLength({ min: 7, max: 30 })
        .withMessage('Password must be between 7 - 30 characters'),
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
    const { name, email, password } = req.body;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user_id = await createUser(name, email, passwordHash);

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/');
}

const showLoginForm = async (req, res) => {
    const title = "Login";
    res.render('login', { title });
}

const processLoginForm = async (req, res) => {
    const { email, password } = req.body;
    const user = await authenticateUser(email, password);
    if (user) {
        req.session.user = user;
        req.flash('success', 'Login Successful!');
        if (res.locals.NODE_ENV === 'development') {
            console.log('User logged in:', user);
        }
        res.redirect('/dashboard');
    } else {
        req.flash('error', 'Invalid email or password');
        res.redirect('/login');
    }
}

const processLogout = async (req, res) => {
    if (req.session.user) {
        delete req.session.user;
    }
    req.flash('success', 'Logout successful!');
    res.redirect('/login');
};

const requireLogin = async (req, res, next) => {
    if (req.session.user) {
        if (res.locals.NODE_ENV === 'development') {
            console.log('requireLogin req.session.user:', req.session.user);
        }
        next();
    } else {
        req.flash('error', 'You must be logged in to access that page.');
        res.redirect('/login');
    }
}

const showDashboard = (req, res) => {
    const user = req.session.user;
    res.render('dashboard', { 
        title: 'Dashboard',
        name: user.name,
        email: user.email
    });
};

const requireRole = (role) => {
    return (req, res, next) => {
        // Check if user is logged in first
        if (!req.session || !req.session.user) {
            req.flash('error', 'You must be logged in to access this page.');
            return res.redirect('/login');
        }
        // Check if user's role matches the required role
        if (req.session.user.role_name !== role) {
            req.flash('error', 'You do not have permission to access this page.');
            return res.redirect('/');
        }
        // User has required role, continue
        next();
    };
};

export { showUserRegistrationForm, processUserRegistrationForm, registerValidation, processLoginForm, showLoginForm, processLogout, requireLogin, showDashboard, requireRole }
