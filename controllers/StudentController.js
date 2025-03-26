const { client } = require("../config/PgConfig");
const bcrypt = require("bcrypt");
const { updateStudent, getStudent, getStudentById ,deleteStudent } = require("../models/students");
const {createStudent ,getStudentByMail} = require('../models/students')
const redis = require('../config/RedisConfig')


const createStudentByadmin = async(req,res)=>{
  const {email  , className , school, password} = req.body
  const profile_pic = req.file ? req.file.path : null;

  if (!email || !password || !className  || !school || !profile_pic) {
    return res.status(400).json({success : false , messgae : "All field required"})
  }

  try {
    console.log(email , className , school , profile_pic , password);
    
    const existingStudent = await getStudentByMail(email);
    
    if (existingStudent) return res.status(409).json({ message: 'Student already exists' });

    const student = await createStudent(email ,className , school , profile_pic , password)
    await redis.del('students_list');
    return res.status(201).json(student);
  } catch (error) {
    // console.log(error);
    return res.status(500).json({success : false ,  message: 'Error creating student: ' + error.message });
  }
}



const updateStudentByAdmin = async(req,res)=>{

try {
    const {id} = req.params
    const {email , className , school} = req.body
    const profile_pic = req.file ? req.file.path : null;
    const result = await updateStudent(id ,email , className, school , profile_pic)
    if (!result) {
      return res.status(400).json({success :false , message : "Student not found"})
    }
    await redis.del('students_list');
    return res.status(200).json({success : true , message : "Data updated" , data : result})
  
} catch (error) {
  
  return res.status(500).json({success : false , message : "Error in update the student"})
}

}

const getStudentByAdmin = async (req,res)=>{
    try {

      const cachedStudents = await redis.get('students_list');
        if (cachedStudents) {
            return res.json(JSON.parse(cachedStudents));
        }

      const students = await getStudent()
      await redis.setEx('students_list' , 3600 , JSON.stringify(students))
      return res.status(200).json({success : true , message : "Users founded" , data : students})
    } catch (error) {
      console.log(error);
      
      return res.status(500).json({success : "error in get data :", error})
    }
}

const getStudentWithIdByAdmin = async (req,res)=>{
  try {
    const {id} = req.params
    if (!id) {
      return res.status(400).json({success : false , message : "Id is important ,  please put id params"})
    }
    const student = await getStudentById(id)
    if (!student) {
      return res.status(404).json({success : false , message : "User not Found"})
    }
    return res.status(200).json({success : true , message : "User Found" , data : student})
  } catch (error) {
    return res.status(500).json({success : false , message : "error in get data by id ",error})
  }

}


const deleteStudentByAdmin = async (req,res)=>{
  try {
    const {id} = req.params
    if (!id) {
      return res.status(400).json({success : false , message : "Id is important to delete student, put the id in query"})
    }

    const student = await deleteStudent(id)
    console.log(student);
    
    if (student.length ===0) {
      return res.status(400).json({success : false , message : "User not Found"})
    }
    await redis.del('students_list');
    return res.status(200).json({success : true ,message : "User deleted" ,  data : student})
  } catch (error) {
    return res.status(500).json({success : false , message : "error in delete data by id ",error})
  }

}

module.exports = {createStudentByadmin,getStudentByAdmin,updateStudentByAdmin ,getStudentWithIdByAdmin , deleteStudentByAdmin}