const router = require('express').Router()
const {loginAdmin,registerStudent, loginStudent} = require('../controllers/AuthController');
const upload = require('../middlewares/Uploads');

//Routes for authentication

router.post('/login-Admin' ,loginAdmin)
router.post('/register-student' , upload.single("profile_pic"),registerStudent)
router.post('/login-student' ,loginStudent)

module.exports = router;