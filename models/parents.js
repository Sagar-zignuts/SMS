const { client } = require("../config/PgConfig");

const createParentTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS parents(
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    relation VARCHAR(50) NOT NULL,
    student_id INTEGER REFERENCES students(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    `;

  try {
    await client.query(query);
    console.log("parent table created successfully");
  } catch (error) {
    console.log(`Error in create table of parent : ${error}`);
  }
};

module.exports = { createParentTable };
