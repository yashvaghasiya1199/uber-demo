const vehicals = require("../models/vehicle")
const jwt = require("jsonwebtoken")

async function addVehicle(req, res) {

  const { type, model, registration_number, color } = req.body

  if (!type || !model || !registration_number) {
    return res.json("all fild must require")
  }

  if (type !== 'car' && type !== 'bike') {
    return res.json({ msg: "vehicle must be car or bike" });
  }

  const reqDriver = req.driver

  const driverToken = jwt.verify(reqDriver, process.env.JWT_SECRET)

  const driverId = driverToken.driverid


  const create = await vehicals.create({
    type,
    model,
    registration_number,
    color,
    driver_id: driverId
  })


  return res.json({ msg: "add vehical", create })
}

async function updateVehicle(req, res) {

  const vehicleId = req.params.vehicleid

  const { type, model, registration_number, color } = req.body

  let findVehical = await vehicals.findOne({ where: { id: vehicleId } })

  if (!findVehical) {
    return res.json({ msg: "vehical not found" })
  }

  const updateVehicles = await findVehical.update({
    type: type || findVehical.type,
    model: model || findVehical.model,
    registration_number: registration_number || findVehical.registration_number,
    color: color || findVehical.color
  })

  return res.json({ updateVehicles })

}

module.exports = {
  addVehicle,
  updateVehicle
}