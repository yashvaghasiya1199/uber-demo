const express = require("express");
const sequelize = require("./config/db");
const cookieparser = require("cookie-parser")
const app = express()
const port = 8002
require("dotenv").config()


// routes
const usrRoute = require("./routes/user")
const driverRoute = require("./routes/driver")
const vehicleRoute = require("./routes/vehicle")
const { signup } = require("./routes/user");

// middelwere 
app.use(express.urlencoded({extended:true}))
app.use(express.json())
const { driverauth } = require("./middelweres/driverauth");
app.use(cookieparser())

const startServer = async () => {
    try {
      await sequelize.authenticate();
      console.log("Database connected successfully.");
      sequelize.sync({ alter: true }) // Or force: true in dev
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
  app.use("/api/vehicle" , driverauth , vehicleRoute )

app.listen(port,()=>console.log(`run on ${port}`))


