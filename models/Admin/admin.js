const bcrypt = require('bcrypt')
const {sequelize} = require('../../config/Database');
const { DataTypes, Sequelize , UUIDV4} = require("sequelize");

//This is admin schema file , in which we just set all the sche
const Admin = sequelize.define("Admin" , {
  id : {
    type : DataTypes.UUID,
    defaultValue : Sequelize.UUIDV4,
    primaryKey : true
  },
  email : {
    type : DataTypes.STRING,
    allowNull : false,
    unique : true
  },
  password : {
    type : DataTypes.STRING,
    allowNull : false
  } 
}, {
  timestamps : true,
  tableName : "admins"
})


//It will generate hashed code for our normal code 
Admin.beforeCreate(async (admin)=>{
    admin.password = await bcrypt.hash(admin.password , 10)
})

module.exports = Admin