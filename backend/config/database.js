const { Sequelize } = require('sequelize');
require('dotenv').config(); // ✅ Load environment variables from .env

// ✅ Parse DATABASE_URL from .env
const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'mysql',
    logging: false, // ✅ Disable logging to clean up terminal output
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});

module.exports = sequelize;
