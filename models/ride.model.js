const {DataTypes, DECIMAL} = require("sequelize")
const sequelize = require("../config/db")

const ride = sequelize.define("ride" , { 
 ride_id:{
    type:DataTypes.UUID,
    defaultValue:DataTypes.UUIDV4,
    primaryKey:true,
    allowNull:false
 },
 user_id: {
    type: DataTypes.UUID,
    allowNull: false
 },
 driver_id: {
    type: DataTypes.UUID,
    allowNull:false
 },
 vehicle_id:{
    type: DataTypes.UUID,
    allowNull: false,
 },
 pickup_latitude:{
    type: DECIMAL(9,6),
    allowNull: false
 },
 pickup_longitude:{
    type: DECIMAL(9,6),
    allowNull: false
 },
 drop_latitude:{
    type: DECIMAL(9,6),
    allowNull: false
 },
 drop_longitude:{
    type: DECIMAL(9,6),
    allowNull: false
 },
 status: {
    type: DataTypes.ENUM('pending', 'accepted', 'ongoing', 'completed', 'cancelled'),
    allowNull:false
 },
 fare_amount: {
    type: DataTypes.DECIMAL(10,2)
 },
 booked_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
 },
 completed_at: {
    type: DataTypes.DATE,
    defaultValue: null
 }

},{
    tableName:'ride',
    timestam: true
})


module.exports = ride