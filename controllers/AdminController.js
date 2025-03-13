const { Plan, User, UserPlan } = require('../models/index'); // Import the models
const moment = require('moment'); // We will use this to set the expiry date for the plan

// Controller to add a new plan
module.exports = {

    async addPlan(req, res) {
        try {
            const { name, price, duration,earn,dailyReward } = req.body;

            // Check if plan with the same name already exists
            const existingPlan = await Plan.findOne({ where: { name } });
            if (existingPlan) {
                return res.status(400).json({ success: false, message: 'Plan with this name already exists' });
            }

            // Create new plan
            const newPlan = await Plan.create({ name, price, duration,earn,dailyReward });

            return res.status(201).json({
                success: true,
                message: 'Plan created successfully',
                plan: newPlan,
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    async getPlans(req, res) {
        try {

            const plans = await Plan.findAll({});
            if (plans.length > 0) {
                const response = plans.map((pln) => ({
                    id: pln.id,
                    name: pln.name,
                    duration: pln.duration,
                    price: pln.price,
                    earn: pln.earn,
                    dailyReward: pln.dailyReward,
                }))

                return res.status(200).json({
                    success: true,
                    plans: response,
                });
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // Controller to assign a plan to a user


};
