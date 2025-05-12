
const sequelize = require("../config/db");
const { DataTypes } = require("sequelize");

const Payment = sequelize.define("Payments", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  ride_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "ride",
      key: "ride_id"
    }
  },
  user_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  driver_id: {
    type: DataTypes.UUID,
    allowNull: false
  },
  fare_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  method: {
    type: DataTypes.ENUM("cash", "online"),
    allowNull: false
  },
  transaction_id: {
    type: DataTypes.STRING,
    allowNull: true
  },
  paid_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'payments',
  timestamps: true
});

module.exports = Payment;
