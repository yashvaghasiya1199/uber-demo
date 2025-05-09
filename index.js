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


// Hello @Harshil Bodara Sir,
// Here are the latest updates for uber project as of Date: May 09, 2025,
// List of Completed Tasks:
//     1) I have completed user can review on their particular ride. [Done]
//     2) I also provide feature when user can delete ride and review  [Done]
//     3) T have also completed driver's document model and upload their document . [Done]
// List of In-Progress Task:
//     1) Currently, I work on update document for drivers and also add more feature. [In-Progress]
// Thanks!
