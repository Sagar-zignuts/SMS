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
    // console.log("parent table created successfully");
  } catch (error) {
    console.log(`Error in create table of parent : ${error}`);
  }
};

const createParent = async(email , name , relation , student_id)=>{
  try {
    const query = `INSERT INTO parents
    (email , name , relation , student_id)
    VALUES
    ($1 , $2 , $3 , $4)
    returning *
    `;
    const values = [email , name , relation , student_id]
    const {rows} =  await client.query(query , values)
    return rows;
  } catch (error) {
    throw new Error("Error in creating parents",error.message)
  }
}

const getParent = async()=>{
  try {
    const query = `SELECT * FROM parents`
    const {rows} =await client.query(query)
    return rows
  } catch (error) {
    throw new Error("Error in getting data",error.message)    
  }
}

const getParentById = async(id)=>{
  try {
    const query = `
    SELECT * FROM parents
    WHERE id = $1
    `;
    const {rows} = await client.query(query , [id])
    console.log(rows);
    
    return rows
  } catch (error) {
    throw new Error("Error in getting parent by id",error.message)
  }
}

const updateParent = async(id , name , email , relation )=>{
  try {
    const query = `
    UPDATE parents
    SET name = $1 , email = $2 , relation = $3
    WHERE id = $4
    returning *
    `;
    const values  = [name , email , relation , id]
  
    const {rows} = await client.query(query , values)
  return rows
  } catch (error) {
    if (error.code === '23505') {
      throw new Error ("This data is already in data base , try unique data")
    }

    throw new error(`Error in updating the parent :,${error.message}`)
  }
}

const deleteParent = async(id)=>{
  try {
    const query =`
    DELETE FROM parents
      WHERE id = $1
      returning *
    `;

    const {rows} =await client.query(query , [id])
    return rows;
  } catch (error) {
    throw new Error("Error in deleting the parent :" , error.message)
  }
}

module.exports = { createParentTable  ,createParent ,deleteParent ,getParent , updateParent ,getParentById};
