const upload = require("../../middlewares/Uploads");

const router = require("express").Router();

const {
    authMiddleware,
    restrictedToAdmin,
  } = require("../../middlewares/AuthMiddleware");

const {createStudent,deleteStudent,getAllStudents,getStudentById,updateStudent, searchStudent} = require('../../controllers/Admin/StudentController')

router.use(authMiddleware)

router.get('/admin/students' ,getAllStudents)
router.get('/admin/'  , getStudentById)
router.post('/admin',restrictedToAdmin , upload.single("profile_pic") , createStudent)
router.delete('/admin' , restrictedToAdmin , deleteStudent)
router.put('/admin' ,restrictedToAdmin, upload.single("profile_pic") , updateStudent)


module.exports= router