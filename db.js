const { Sequelize } = require('sequelize');
require('dotenv').config();


// Initialize Sequelize
const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: process.env.DIALECT,
        port: process.env.DB_PORT,
        logging: false,
    }
);

// Export the sequelize instance
module.exports = sequelize;
