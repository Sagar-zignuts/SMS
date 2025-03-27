// const router = require('express').Router()
// const {loginAdmin,registerStudent, loginStudent} = require('../controllers/AuthController');
// const upload = require('../middlewares/Uploads');

// //Routes for authentication

// router.post('/login-Admin' ,loginAdmin)
// router.post('/register-student' , upload.single("profile_pic"),registerStudent)
// router.post('/login-student' ,loginStudent)

// module.exports = router;

const router = require('express').Router()
const {loginAdmin} = require('../controllers/Admin/AuthController')
const {loginStudent,registerStudent} = require('../controllers/Users/AuthController')
const upload = require('../middlewares/Uploads')

router.post('/login-admin' , loginAdmin)
router.post('/login-student' , loginStudent)
router.post('/register-student' , upload.single('profile_pic'),registerStudent)

module.exports = router