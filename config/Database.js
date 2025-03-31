const { Sequelize } = require('sequelize');
require('dotenv').config();

//Function for connect the Sequelize with our app
const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    dialect: 'postgres',
    logging: false,
  }
);

//Just check if connection is establised or not ,  It is not necessary.
const checkConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Sequelize connected successfully');
  } catch (error) {
    console.log('Error in connection of sequelize', error);
  }
};
checkConnection();

module.exports = { sequelize };
