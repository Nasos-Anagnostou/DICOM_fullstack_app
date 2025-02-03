const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DicomFile = sequelize.define('DicomFile', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    filename: { type: DataTypes.STRING, allowNull: false },
    patientName: { type: DataTypes.STRING },
    birthDate: { type: DataTypes.STRING },
    seriesDescription: { type: DataTypes.STRING },
    filePath: { type: DataTypes.STRING },
});

module.exports = DicomFile;
