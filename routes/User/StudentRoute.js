const upload = require("../../middlewares/Uploads");

const router = require("express").Router();

const {
    authMiddleware,
    restrictedTo,
  } = require("../../middlewares/AuthMiddleware");

const {createStudent,deleteStudent,getAllStudent,getStudentById,updateStudent, searchStudent} = require('../../controllers/Admin/StudentController')

router.use(authMiddleware)

router.get('/students' , restrictedTo('admin' , 'student'),getAllStudent)
// router.get('/search' , restrictedTo('admin' , 'student') , searchStudent)
router.get('/' , restrictedTo('admin' , 'student') , getStudentById)
router.post('/', restrictedTo('admin') , upload.single("profile_pic") , createStudent)
router.delete('/' , restrictedTo('admin') , deleteStudent)
router.put('/' , restrictedTo('admin'), upload.single("profile_pic") , updateStudent)

module.exports = router;