const {literal} = require("sequelize")

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const toRad = deg => (deg * Math.PI) / 180;
  
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
  
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  }


  function distanceCondition(userLat, userLng, radiusKm = 10) {
    return literal(`
      6371 * acos(
        cos(radians(${userLat})) *
        cos(radians("driverlocation"."latitude")) *
        cos(radians("driverlocation"."longitude") - radians(${userLng})) +
        sin(radians(${userLat})) *
        sin(radians("driverlocation"."latitude"))
      ) < ${radiusKm}
    `);
  }
  

  module.exports = {
    calculateDistance,
    distanceCondition
  }