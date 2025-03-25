const { client } = require("../config/PgConfig");
const bcrypt = require("bcrypt");

const createStudentTable = async () => {
  
  try {
    const query = `
      CREATE TABLE IF NOT EXISTS students(
      id SERIAL PRIMARY KEY,
      email VARCHAR(255) UNIQUE NOT NULL,
      className VARCHAR(100) NOT NULL,
      school VARCHAR(255) NOT NULL,
      profile_pic VARCHAR(255),
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
      `;
    await client.query(query);
  } catch (error) {
    // console.log(`Error in create table of student : ${error}`);
    throw new Error("Error in create table of student")
  }
};
const createStudent = async (
  email,
  className,
  school,
  profile_pic,
  password
) => {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
          insert into students (email , className , school , profile_pic, password)
          values
          ($1 , $2 , $3 , $4 , $5)
          RETURNING *
          `;
    const values = [email, className, school, profile_pic, hashedPassword];
    console.log(email , className , school , profile_pic , hashedPassword);
    
    const { rows } = await client.query(query, values);
    return rows[0];
  } catch (error) {
    console.log(error);
    throw new Error("Error Creating student: " + error.message);
  }
};

const getStudent = async () => {
  try {
    const { rows } = await client.query("SELECT * FROM students");
    return rows;
  } catch (error) {
    throw new Error("Error finding student: " + error.message);
  }
};

const getStudentByMail = async (email) => {
  try {
    const { rows } = await client.query(
      "SELECT * FROM students WHERE email = $1",
      [email]
    );
    return rows[0];
  } catch (error) {
    throw new Error("Error finding student by email: " + error.message);
  }
};

const getStudentById = async (id) => {
  try {
    const { rows } = await client.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );
    return rows[0];
  } catch (error) {
    throw new Error("Error finding student by Id: " + error.message);
  }
};

const updateStudent = async (id, email, className, school, profile_pic) => {
  try {
    const query = `
      UPDATE students 
      SET email = $1 , className = $2 , school = $3, profile_pic = COALESCE($4, profile_pic)
        WHERE id = $5
        RETURNING *
        `;

    const value = [email, className, school, profile_pic, id];
    const { rows } = await client.query(query, value);
    return rows[0];
  } catch (error) {
    console.log(error);
    
    throw new Error("error in update the user :", error.message)
  }
};

const deleteStudent = async(id)=>{
  try {
    const query = `
    DELETE FROM students
    WHERE id = $1
    returning *`;
    const {rows} =await client.query(query, [id])
    return rows
  } catch (error) {
    throw new Error("Error in delete data : ",error.message)
  }
}

module.exports = {
  createStudentTable,
  createStudent,
  getStudent,
  getStudentById,
  getStudentByMail,
  updateStudent,
  deleteStudent
};
