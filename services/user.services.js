const Users = require("../models/user.model")

const {Op} = require("sequelize")

async function findUserByEmailorUsername(emailorusername){
  
    console.log("emailorusername" , emailorusername);

    return await Users.findOne({
        where: {
          [Op.or]: [{ email: emailorusername }, { username: emailorusername }],
        },
      });


}

module.exports  = {
  findUserByEmailorUsername,
}