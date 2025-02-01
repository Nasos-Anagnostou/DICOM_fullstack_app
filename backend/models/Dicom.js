const { DataTypes } = require('sequelize');
const sequelize = require('./index');

const Dicom = sequelize.define('Dicom', {
    patientName: { type: DataTypes.STRING, allowNull: false },
    birthDate: { type: DataTypes.STRING, allowNull: false },
    seriesDescription: { type: DataTypes.STRING, allowNull: false },
    filePath: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Dicom;