
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Ride = require("../models/ride.model")

const review = sequelize.define("reviews", {
  review_id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    allowNull: false
  },
  ride_id: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: "rides",
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
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      max: 5
    }
  },
  deleted_at: {
    type: DataTypes.DATE,
    defaultValue: null
  }
}, {
  tableName: "reviews",
  timestamps: true
});



module.exports = review;
