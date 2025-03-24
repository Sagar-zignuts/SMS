const { client } = require("../config/PgConfig");
const bcrypt = require("bcrypt");

const createStudentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS students(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    className VARCHAR(100) NOT NULL,
    school VARCHAR(255) NOT NULL,
    peofile_pic VARCHAR(255),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

  try {
    await client.query(query);
    console.log("Student table created successfully");
  } catch (error) {
    console.log(`Error in create table of student : ${error}`);
  }
};



module.exports = { createStudentTable };