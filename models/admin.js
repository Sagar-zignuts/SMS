const e = require("express");
const { client } = require("../config/PgConfig");
const bcrypt = require('bcrypt')

const createAdminTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )`;

  try {
    await client.query(query);
    // console.log("admin table created successfully");
  } catch (error) {
    console.log(`Error in create table of admin : ${error}`);
  }
};

const findByEmail = async(email)=>{
    const query = `
    SELECT * FROM admins
    WHERE email = $1`;
    console.log(email);
    
    const {rows} = await client.query(query,[email])
    return rows[0];
}

module.exports = { createAdminTable ,findByEmail};
