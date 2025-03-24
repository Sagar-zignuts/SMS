const { client } = require("../config/PgConfig");
const bcrypt = require("bcrypt");
const redis = require("../config/RedisConfig");

const createStudent = async (req, res) => {
  try {
    const { email, className, school, profile_pic, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = `
          insert into students (email , className , school , profile_pic,password)
          values
          $1 , $2 , $3 , $4 , $5
          `;
    const values = [email, className, school, profile_pic, hashedPassword];
    const { rows } = await client.query(query, values);
    return rows[0];
  } catch (error) {
    console.log(`error in create user : ${error}`);
    return res
      .status(500)
      .json({ success: false, message: "Error in create student" });
  }
};

const getStudent = async (req, res) => {
  const cacheKey = "student :all";
  try {
    const cached = await redis.get(cacheKey);
    if (cached) {
      return res.json({ success: true, data: JSON.parse(cached) });
    }
    const { rows } = await client.query("SELECT * FROM students");
    await redis.setEx(cacheKey, 3600, JSON.stringify(rows));
    return res.json({ success: true, data: rows });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching books",
        error: error.message,
      });
  }
};

const getStudentById = async (req, res) => {
  const { id } = req.params;
  try {
    const { rows } = await client.query(
      "SELECT * FROM students WHERE id = $1",
      [id]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }
    return res.json({ success: true, data: rows[0] });
  } catch (error) {
    return res
      .status(500)
      .json({
        success: false,
        message: "Error fetching student",
        error: error.message,
      });
  }
};


const updateStudent = async (req,res)=>{
    const { id } = req.params;
    const { email, className, school } = req.body;
    const cover_image = req.file ? req.file.path : null;
  
    try {
      const query = `
      UPDATE books 
      SET title = $1 , description = $2 , author_id = $3 , publication = $4, cover_image = COALESCE($5, cover_image)
        WHERE id = $6
        RETURNING *
        `;
  
        const value = [title , description , author_id ,publication  ,cover_image , id]
        const {rows} = await pg.query(query,value)
  
        if (rows.length === 0) {
          return res.status(404).json({ success: false, message: 'Book not found' });
        }
  
        await redis.del('books:*');
        return res.json({ success: true, data: rows[0] });
    } catch (error) {
      if (error.code === '23503') {
        return res.status(400).json({ success: false, message: 'Invalid author_id: Author does not exist' });
      }
      return res.status(500).json({ success: false, message: 'Error updating book', error: error.message });
    }
  }