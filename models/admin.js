const { client } = require("../config/PgConfig");

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
    console.log("admin table created successfully");
  } catch (error) {
    console.log(`Error in create table of admin : ${error}`);
  }
};

module.exports = { createAdminTable };
