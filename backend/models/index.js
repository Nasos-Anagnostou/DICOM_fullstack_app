const sequelize = require('../config/database');
const DicomFile = require('./DicomFile');

const db = { sequelize, DicomFile };

module.exports = db;
