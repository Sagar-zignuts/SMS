const upload = require("../middlewares/Uploads");

const router = require("express").Router();

const {
    authMiddleware,
    restrictedTo,
  } = require("../middlewares/AuthMiddleware");

const {createStudent,deleteStudent,getStudent,getStudentById,updateStudent, searchStudent} = require('../controllers/StudentController')

router.use(authMiddleware)

router.get('/' , restrictedTo('admin' , 'student'),getStudent)
router.get('/:id' , restrictedTo('admin' , 'student') , getStudentById)
router.post('/', restrictedTo('admin') , upload.single("profile_pic") , createStudent)
router.delete('/' , restrictedTo('admin') , deleteStudent)
router.put('/' , restrictedTo('admin'), upload.single("profile_pic") , updateStudent)
router.get('/search' , restrictedTo('admin' , 'student') , searchStudent)

module.exports = router;