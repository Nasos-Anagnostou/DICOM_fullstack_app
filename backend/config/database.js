const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('dicomdb', 'user', 'password', {
    host: 'dicom_fullstack_app-mysql-1',
    dialect: 'mysql'
});

module.exports = sequelize;
