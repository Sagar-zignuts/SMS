const {createParent , createParentTable ,deleteParent,getParent,getParentById, updateParent} = require('../models/parents')
const {client} = require('../config/PgConfig')
const bcrypt=  require('bcrypt')

const createParentByAdmin = async (req , res)=>{
    try {
        const {email , name , relation , student_id} = req.body

        if (!email || !name  || !relation || !student_id) {
            return res.status(400).json({success : false , message : "All field is required"})
        }

        const parent = await createParent(email , name ,relation, student_id)
        // if (!parent) {
        //     return res.status(400).json({success : false , message : "Parent "})
        // }
            return res.status(200).json({success : true , message : "Parent created" , data : parent})
    } catch (error) {
        return res.status(500).json({success : false , message :"Error in creating  pareetn"+error.message})
    }
}

const updateParentByAdmin = async (req,res)=>{
        try {
            const {id} = req.params
            const {name , relation , email} = req.body
    
            if (!relation || !email) return res.status(400).json({ message: 'Missing fields' });
            const parent = await updateParent(id , name , email , relation)
            if (result.rows.length === 0) return res.status(404).json({ message: 'Parent not found' });
        return res.json(result.rows[0]);
        } catch (error) {
            return res.status(500).json({ message: 'Error updating parent: ' + error.message });
        }
}


const deleteParentByAdmin = async (req, res) => {
    const { id } = req.params;
  
    try {
      const result = await deleteParent(id);
      if (result.length === 0) return res.status(400).json({ message: 'Parent not found' });
      return res.status(200).json({ message: 'Parent deleted', parent: result});
    } catch (error) {
      return res.status(500).json({ message: 'Error deleting parent: ' + error.message });
    }
  };

const getParentByAdmin = async(req,res)=>{
try {
        const result = await getParent()
        if (!result) {
            return res.status(400).json({ message: 'Parent not found in search' }); 
        }
        return res.status(200).json({success : true , message: 'All Parents', parent: result });
    
} catch (error) {
    return res.status(500).json({success : false ,  message: 'Error getting parent: ' + error.message });
}
}



const getParentWithIdByAdmin = async(req,res)=>{
    try {
        const {id}= req.params
            const result = await getParentById(id)
            if (!result) {
                return res.status(400).json({ message: 'Parent not found in search by id' }); 
            }
            return res.status(200).json({success : true , message: 'Parent', parent: result });
        
    } catch (error) {
        return res.status(500).json({success : false ,  message: 'Error getting parent by id: ' + error.message });
    }
    }
    
module.exports = {createParentByAdmin , updateParentByAdmin , deleteParentByAdmin , getParentByAdmin , getParentWithIdByAdmin}