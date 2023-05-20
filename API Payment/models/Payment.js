const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Payment = sequelize.define("Payment", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  active: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: { len: [1, 200] },
  },
  hours: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 200],
    },
  },
  plan: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },
  user: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1, 100],
    },
  },

  pay: {
    type: DataTypes.DOUBLE,
    allowNull: false,
    validate: {
      len: [0, 10],
    },
  },
  startDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  finishDate: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    allowNull: false,
  },
});

module.exports = Payment;
