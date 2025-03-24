const { Client } = require("pg");

const client = new Client({
  user: "postgres",
  host: "localhost",
  port: 5432,
  password: "password",
  database: "SMS",
});

client
  .connect()
  .then(() => console.log("PostgreSQL connected successfully"))
  .catch((err) => console.log(`Connection error : ${err}`));

  module.exports = {client};