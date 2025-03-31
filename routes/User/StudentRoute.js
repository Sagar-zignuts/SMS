const upload = require('../../middlewares/Uploads');

const router = require('express').Router();

const { authMiddleware } = require('../../middlewares/AuthMiddleware');

const {
  getStudentById,
  getAllStudents,
} = require('../../controllers/Admin/StudentController');

router.use(authMiddleware);

router.get('/students', getAllStudents);
router.get('/', getStudentById);

module.exports = router;
