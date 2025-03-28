const bcrypt = require("bcrypt");
const StudentModel = require('../models/students')
const validator = require('validatorjs')
const {Op} = require('sequelize')
const redis = require('../config/RedisConfig')

const createStudent = async(req,res)=>{
    try {
        const validation = new validator(req.body , {
            email : 'required|email',
            className : 'required',
            school : 'required',
            password : 'required'
        })

        
        if (validation.fails()) {
            return res.status(400).json({status : 400 , message : "Field is required"})
        }
        const {email , className, school , password} = req.body
        const profile_pic = req.file ? req.file.path : null; 
        
        redisKey = `student : ${student.id}`
        const student= await StudentModel.create({email , className , school , profile_pic , password})

        await redis.setEx(`student` ,3600, JSON.stringify(student))

        return res.status(200).json({status : 200 , message : "Student created" , data : student})
    } catch (error) {  
        return res.status(500).json({status : 500 , message : "server Error in create student"})
    }
}

const getStudent = async (req,res)=>{
    try {
        const result = await StudentModel.findAll({
            attributes : ['id' , 'email' , 'className' , 'school' , 'profile_pic' , 'createdAt']
        })


        return res.status(200).json({status:200 , message : "All data fetched" , data : result})
    } catch (error) {
        return res.status(500).json({status:500 , message : "Server error in all data fetch"})
    }
}

const getStudentById = async(req,res)=>{
    try {
        
        const student = await StudentModel.findByPk(req.params.id , {
            attributes : ['id' , 'email' , 'className' , 'school' , 'profile_pic' , 'createdAt']
        })

        const redisKey = `student : ${req.params.id}`
        const cachedStudent = await redis.get(redisKey)

        if (cachedStudent) {
            return res.json(JSON.parse(cachedStudent));
        }

        if (!student) {
            return res.status(400).json({status:400 , message:"student not found"})
        }

        await redis.setEx(redisKey, 3600, JSON.stringify(student));
        return res.status(200).json({status:200 , message : "Data fetched" , data : student})
    } catch (error) {
        return res.status(500).json({status:500 , message : "Server error in data fetch"})
    }
}

const updateStudent = async (req,res)=>{
    try {
        const student_id = req.headers["student_id"]

        console.log(student_id);
        
        const validation = new validator(req.body , {
            email : "required|email",
            className : "required",
            school :'required'
        })
        
        if (validation.fails()) {
            return res.status(400).json({ status : 400, message : `Error in validation : ${validation.errors.all()}` });
        }
        const profile_pic = req.file ? req.file.path : null;
        const {email , className , school} = req.body

        if (req.user.role === "student" && req.user.id !== student_id) {
            return res.status(403).json({ status: 400, message: 'You can only update your own profile' });
        }
        
        const updates = {
            email: email,
            className: className,
            school: school,
            profilePic: profile_pic
        };

        const student = await StudentModel.findByPk(student_id)
        if (!student) {
            return res.status(400).json({status : 400 , message  : "Student not exiest"})
        }

        const data = await StudentModel.update(updates , 
            {
            where : {id : student_id}
        }
    )

    const redisKey = `student:${student_id}`
    const cachedStudent = redis.setEx(student , 3600 , JSON.stringify(data))

        return res.status(200).json({status : 200 , message : "Student updated" , data : data})

    } catch (error) {
        return res.status(500).json({status:500 , message : "Server error in data Update"})
    }
}


const deleteStudent = async (req,res)=>{
    try {
        const student_id = req.headers["student_id"]
        if (!student_id) {
            return res.status(404).json({ status: 400, message: 'Id required' });
        }

        const student = await StudentModel.findByPk(student_id)
        if (!student) {
            return res.status(404).json({ status:400, message: 'Student not found' });
        }

        const data = await student.destroy()
        const redisKey = `student:${student_id}`;
        await redis.del(redisKey);
        return res.status(200).json({status : 200 , message : "Student deleted" , data : data})
    } catch (error) {
        return res.status(500).json({status:500 , message : "Server error in data delete"})
    }
}

const searchStudent = async(req,res)=>{
    try {
        const email = req.headers["email"]
        const className = req.headers["className"]
        const school = req.headers["school"]
        
       const where = {}
       if (email) where.email = {[Op.like] : `%${email}%`}
       if (className) where.name = {[Op.like] : `%${className}%`}
       if (school) where.relation = {[Op.like] : `%${school}%`}

       if (Object.keys.length === 0) {
        return res.status(400).json({ 
            status: 400, 
            message: 'At least one search parameter (email, name, relation) is required' 
        });
       }
       const students =await StudentModel.findAll({
        where,
        attributes : ['id', 'email', 'class', 'school', 'profile_pic', 'createdAt']
       })

       if (students.length === 0) {
        return res.status(404).json({ 
            status: 404, 
            message: 'No students found matching the criteria' 
        });
    }

    return res.status(200).json({ 
        status: 200, 
        message: 'Students found', 
        data: students 
    });

    } catch (error) {
        return res.status(500).json({ 
            status: 500, 
            message: 'Server error in search students' 
        });
    }
}

module.exports = {createStudent , updateStudent , deleteStudent , getStudent , getStudentById ,searchStudent}