const { Sequelize } = require('sequelize');
require('dotenv').config();  // ✅ Load environment variables from .env

// ✅ Check if DATABASE_URL is correctly set
if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not defined! Check your .env file.");
    process.exit(1);  // Stop execution if DATABASE_URL is missing
}

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false, // ✅ Disable logging for cleaner output
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
