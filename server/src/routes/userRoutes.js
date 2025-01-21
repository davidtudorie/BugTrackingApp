const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models');
const { authenticateToken } = require('../middleware/authMiddleware');

const SECRET_KEY = process.env.SECRET_KEY || 'secret';

//lista toti userii
router.get('/', authenticateToken, async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch users'
        });
    }
});

// creare user
router.post('/', async (req, res) => {
    const {
        email,
        password,
        role
    } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            email,
            password: hashedPassword,
            role
        });
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to create user'
        });
    }
});


// autentificare user
router.post('/login', async (req, res) => {
    const {
        email,
        password
    } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                error: 'Invalid password'
            });
        }

        const token = jwt.sign({
            id: user.id,
            role: user.role
        }, process.env.SECRET_KEY || 'secret', {
            expiresIn: '1h',
        });

        res.status(200).json({
            token,
            role: user.role
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Failed to authenticate user'
        });
    }
});

//rol user
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'email', 'role']
        });
        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch user'
        });
    }

});


module.exports = router;