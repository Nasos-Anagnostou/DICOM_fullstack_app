const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mysql'
});

module.exports = sequelize;

// backend/models/Dicom.js
const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Dicom = sequelize.define('Dicom', {
    patientName: { type: DataTypes.STRING, allowNull: false },
    birthDate: { type: DataTypes.STRING, allowNull: false },
    seriesDescription: { type: DataTypes.STRING, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Dicom;