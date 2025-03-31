const router = require('express').Router();
const { loginAdmin } = require('../../controllers/Admin/AuthController');

router.post('/login-admin', loginAdmin);

module.exports = router;
