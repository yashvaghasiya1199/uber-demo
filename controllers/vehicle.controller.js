const vehicals = require("../models/vehicle.model")
const jwt = require("jsonwebtoken")
const Driver = require("../models/driver.model")
const Vehicle = require("../models/vehicle.model")
const { driverIdFromRequest } = require("../services/driver.services")

async function addVehicle(req, res) {

  const { type, model, registration_number, color } = req.body

  if (!type || !model || !registration_number) {
    return res.json({msg:"all fild must require" ,error:true})
  }

  if (type !== 'car' && type !== 'bike') {
    return res.json({ msg: "vehicle must be car or bike" ,error:true});
  }

  const driverId = driverIdFromRequest(req,res)

  const create = await vehicals.create({
    type,
    model,
    registration_number,
    color,
    driver_id: driverId
  })


  return res.json({ msg: "add vehicle", create ,error:false})
  
}

async function updateVehicle(req, res) {

  const vehicleId = req.params.id

  const { type, model, registration_number, color } = req.body

  let findVehical = await vehicals.findOne({ where: { id: vehicleId } })

  if (!findVehical) {
    return res.json({ msg: "vehical not found" ,error:true})
  }

  const updateVehicles = await findVehical.update({
    type: type || findVehical.type,
    model: model || findVehical.model,
    registration_number: registration_number || findVehical.registration_number,
    color: color || findVehical.color
  })

  return res.json({ updateVehicles,error:false })

}

async function getDriverAllVehicles(req,res) {

  const driverId = driverIdFromRequest(req,res)
  
  try {
    const driver = await Driver.findOne({
      where: { id: driverId },
      include: [{
        model: Vehicle,  
        required: false, 
      }]
    });

    if (!driver) {
      return { message: 'Driver not found' ,error:true};
    }

    return res.json({driver,error:false});  
  } catch (error) {
    console.error(error);
    return { message: 'Error fetching data' ,error:true};
  }
}

async function findSingleVahicle(req,res){

  let vehicleId = req.params.id

  if (!vehicleId){
    return res.json({msg:"vehicleid roungh or vehicals not found",error:true})
  }

  let findvehicle = await Vehicle.findOne({where:{vehicle_id:vehicleId}})
  
  if(!findvehicle){
    return res.josn({msg:"vehicle not found",error:true})
  }

  return res.json({msg:findvehicle,error:false})
  
}

async function deleteVehicle(req,res) {
  
  const vehicleId =  req.params.id

  const driverId = driverIdFromRequest(req,res)
  
  let vehicle = await Vehicle.findOne({where:{vehicle_id:vehicleId}})
  // console.log(vehicle);

  if(!vehicle){
    return res.json({msg:"vehicle id not find",error:true})
  }
  if (vehicle.driver_id !== driverId) {
    return res.status(403).json({ msg: "Unauthorized: You cannot delete this vehicle" ,error:true});
  }

  let removeVehicles = await vehicals.destroy({where:{vehicle_id:vehicleId}})
  

  return res.json({msg:"vehicle delete successfull" , deleteVehicle,error:false})

}
module.exports = {
  addVehicle,
  updateVehicle,
  getDriverAllVehicles,
  findSingleVahicle,
  deleteVehicle
}
