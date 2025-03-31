const router = require('express').Router();
const {
  loginStudent,
  registerStudent,
} = require('../../controllers/Users/AuthController');
const upload = require('../../middlewares/Uploads');

router.post('/login-student', loginStudent);
router.post('/register-student', upload.single('profile_pic'), registerStudent);

module.exports = router;
