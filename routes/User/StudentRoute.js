const upload = require("../../middlewares/Uploads");

const router = require("express").Router();

const {
    authMiddleware,
  } = require("../../middlewares/AuthMiddleware");

const {getStudentById, getAllStudents} = require('../../controllers/Admin/StudentController')

router.use(authMiddleware)

router.get('/students' ,getAllStudents)
// router.get('/search' , restrictedTo('admin' , 'student') , searchStudent)
router.get('/'  , getStudentById)

module.exports = router;