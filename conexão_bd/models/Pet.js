    // models/Pet.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../database');

const Pet = sequelize.define('Pet', {
  name: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  adopted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
}, {
});

module.exports = Pet;