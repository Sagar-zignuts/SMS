const { Client } = require("pg");
require('dotenv').config()

//PostgreSQL connection part

const client = new Client({
  user: process.env.PG_USER,
  host:process.env.PG_HOST,
  port: process.env.PG_PORT,
  password: process.env.PG_PASSWORD,
  database: process.env.PG_DATABASE,
});

client
  .connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((err) => console.log(`Connection error : ${err}`));

  module.exports = {client};