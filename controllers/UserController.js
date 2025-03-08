const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models/index'); // Import User model
const router = express.Router();

module.exports = {

    async signupUser(req, res, next) {
        try {
            const { email, phoneNumber, password, withdrawPassword, invitationCode } = req.body;
            // Check if the invitation code exists
            // console.log(req.body)
            let referrer = null;
            if (invitationCode) {
                referrer = await User.findOne({ where: { invitationCode } });

                if (!referrer) {
                    return res.status(400).json({ message: 'Invalid invitation code' });
                }
            }

            // Hash passwords
            const hashedPassword = await bcrypt.hash(password, 10);
            const hashedWithdrawPassword = await bcrypt.hash(withdrawPassword, 10);

            // Create new user
            const newUser = await User.create({
                email,
                phoneNumber,
                password: hashedPassword,
                withdrawPassword: hashedWithdrawPassword,
                referrerId: referrer ? referrer.id : null, // Store the referrer's user ID
            });

            res.status(201).json({ message: 'User created successfully', user: newUser });
        } catch (error) {
            next(error)
        }
    },

    async signinUser(req, res) {
        try {
            const { email, password } = req.body;

            // Check if user exists
            const user = await User.findOne({ where: { email } });
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Validate password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_KEY,
                { expiresIn: '8h' } // Set expiration time as needed
            );

            // Remove sensitive fields from the user object
            const userResponse = {
                id: user.id,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
            };

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                token, // Send the token to the client
                user: userResponse, // Return sanitized user data
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Internal server error' });
        }
    },

    async userProfile (req, res, next){
        try {
          const user = await User.findByPk(req.user.id); // Access the user info from the decoded token
          return res.status(200).json({success:true,user});
        } catch (err) {
          next(err)
        }
    }

}
