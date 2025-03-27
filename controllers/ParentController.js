const redis = require('../config/RedisConfig')
const validator = require('validatorjs')
const ParentModel = require('../models/parents')
const StudentModel = require('../models/students')


const createParent = async (req,res)=>{
    try {
        const validation = new validator(req.body , {
            email : 'required|email',
            name : 'required',
            relation : 'required',
            Student_id : 'required'
        })
        if (validation.fails()) {
            return res.status(400).json({status : 400 , message : "Field is required"})
        }

        const {email , name , relation , Student_id} = req.body
        const parent = await ParentModel.create({email , name , relation , Student_id})
        return res.status(200).json({status : 200 , message : "Parent created" , data : parent})
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({status : 500 , message : "server Error in create student"})
    }
}
const getParent  =async (req,res)=>{
    try {
        const parent = await ParentModel.findAll({
            attributes : ['id', 'email' , 'name' ,'relation', 'Student_id']
        })
        return res.status(200).json({status:200 , message : "All data fetched" , data : parent})
    } catch (error) {
        return res.status(500).json({status:500 , message : "Server error in all data fetch"})
    }
}

const getParentById = async (req,res)=>{
    try {
        const parent = await ParentModel.findByPk(req.params.id , {
            attributes : ['id', 'email' , 'name','relation', 'Student_id']
        })
        if (!parent) {
            return res.status(400).json({status:400 , message:"parent not found"})
        }
        return res.status(200).json({status:200 , message : "Data fetched" , data : parent})
    } catch (error) {
        return res.status(500).json({status:500 , message : "Server error in all data fetch"})
    }
}

const updateParent = async (req,res)=>{
    try {
        const parent_id = req.headers['parent_id']
        const validation = new validator(req.body , {
            email : "required|email",
            name : 'required',
            relation : 'required',
            Student_id : 'required'
        })

        if (validation.fails()) {
            return res.status(400).json({ status : 400, message : `Error in validation : ${validation.errors.all()}` });
        }

        const {email, name , relation,Student_id} = req.body

        const updates = {
            email,
            name,
            relation,
            Student_id
        }

        const parent= await ParentModel.findByPk(parent_id)
        if (!parent) {
            return res.status(400).json({status : 400 , message  : "parent not exiest"})
        } 

        const result= await ParentModel.update(updates , {
            where : {id : parent_id}
        })
         return res.status(200).json({status : 200 , message : "parent updated" , data : result})
    } catch (error) {
        return res.status(500).json({status:500 , message : "Server error in update data"})
    }
}

const deleteParent = async (req,res)=>{
    try {
        const parent_id = req.headers['parent_id']
        const parent = await ParentModel.findByPk(parent_id)
        if (!parent) {
            return res.status(400).json({status : 400 , message : "Parent is not exists"})
        }
        const result = await parent.destroy()
        return res.status(200).json({status : 200 , message : "parent deleted" , data : result})
    } catch (error) {
        return res.status(500).json({status:500 , message : "Server error in update data"})
    }
}

module.exports = {createParent,getParent , getParentById , deleteParent ,updateParent}