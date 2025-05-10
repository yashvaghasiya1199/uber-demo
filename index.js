const express      = require("express");
const sequelize    = require("./config/db");
const cookieparser = require("cookie-parser")
const app          = express()
const fileUpload   = require("express-fileupload")
const port = 8002
require("dotenv").config()



// routes
const usrRoute     = require("./routes/user.route")
const driverRoute  = require("./routes/driver.route")
const vehicleRoute = require("./routes/vehicle.route")
const rideRoute    = require("./routes/ride.route")
const reviewRoute  = require("./routes/review")

// middelwere 
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const { driverAuth } = require("./middelweres/driverauth");
const { userAuth } = require("./middelweres/userauth");
app.use(cookieparser())
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/', 
}));

const startServer = async () => {
    try {
      await sequelize.authenticate
      ();
      console.log("Database connected successfully.");
      sequelize.sync({ alter: false }) 
      .then(() => console.log("DB synced"))
      .catch(err => console.error("Sync failed:", err))
    } catch (error) {
      console.error(" Unable to connect to the database:", error);
    }
  };
  
  startServer();

  //  route
  app.use("/api/user" ,usrRoute)

  app.use("/api/driver" , driverRoute)

  app.use("/api/vehicle" , driverAuth , vehicleRoute )

  app.use("/api/ride" ,  userAuth ,rideRoute)

  app.use("/api/review" , userAuth , reviewRoute)
  


app.listen(port,()=>console.log(`run on ${port}`))




