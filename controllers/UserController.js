const express = require('express');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const bcrypt = require('bcrypt');
const { Op } = require('sequelize');
const { User, Plan, UserPlan } = require('../models/index'); // Import User model
const router = express.Router();
const {getUsdtBalance}=require('../tronUtils')

module.exports = {

    async signupUser(req, res, next) {
        try {
            const { firstName, lastName, email, phoneNumber, password, withdrawPassword, invitationCode } = req.body;
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
                firstName,
                lastName,
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
            const { email, phoneNumber, password } = req.body;

            // Ensure only one of email or phoneNumber is provided
            if ((!email && !phoneNumber) || (email && phoneNumber)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please provide either email or phone number, but not both.'
                });
            }

            // Find user by either email or phoneNumber
            const user = await User.findOne({
                where: {
                    [Op.or]: [
                        email ? { email } : {},
                        phoneNumber ? { phoneNumber } : {}
                    ]
                }
            });

            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: 'User not found'
                });
            }

            // Validate password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid password'
                });
            }

            // Generate JWT Token (valid for 5 hours)
            const token = jwt.sign(
                { userId: user.id, role: user.role },
                process.env.JWT_KEY,
                { expiresIn: '5h' }
            );

            // Prepare user response (exclude sensitive fields)
            const userResponse = {
                id: user.id,
                uid: user.uid,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
            };

            return res.status(200).json({
                success: true,
                message: 'Login successful',
                token, // Send the JWT token
                user: userResponse, // Return sanitized user data
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    async userProfile(req, res, next) {
        try {
            const user = await User.findByPk(req.user.id);
            // Access the user info from the decoded token
            const userResponse = {
                id: user.id,
                uid: user.uid,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                phoneNumber: user.phoneNumber,
                role: user.role,
            };
            return res.status(200).json({ success: true, user: userResponse });
        } catch (err) {
            next(err)
        }
    },
    async assignPlanToUser(req, res) {
        try {
            const { planId } = req.body;

            // Fetch user and plan
            const user = await User.findByPk(req.user.id);
            const plan = await Plan.findByPk(planId);

            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }

            if (!plan) {
                return res.status(404).json({ success: false, message: 'Plan not found' });
            }
            const userBalance = await getUsdtBalance(user.trx20DepositAddress);
            console.log(`User User Balance: ${userBalance} USDT`);
            if (userBalance < plan.price) {
                return res.status(400).json({ message: 'Insufficient balance. Deposit more funds to purchase this plan.' });
            }
            // Calculate the expiry date of the plan
            const expiresAt = moment().add(plan.duration, 'days').toDate();

            // Create UserPlan association
            const userPlan = await UserPlan.create({
                userId: req.user.id,
                planId,
                expiresAt, // Set expiry based on duration in days
                paymentStatus: 'completed',
                paymentDate: new Date(),
                paymentTransactionId: `TEST-${Date.now()}`, // Fake transaction ID for test

            });

            return res.status(200).json({
                success: true,
                message: 'Plan assigned to user successfully',
                userPlan,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

}


