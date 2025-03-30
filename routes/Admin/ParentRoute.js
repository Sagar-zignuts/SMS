const router = require("express").Router();
const {createParent,deleteParent,getAllParents,getParentById,updateParent} = require('../../controllers/Admin/ParentController')
const {authMiddleware , restrictedToAdmin} = require("../../middlewares/AuthMiddleware")

router.use(authMiddleware)

router.post('/admin',restrictedToAdmin , createParent)
router.get('/admin/parents', restrictedToAdmin , getAllParents)
router.get('/admin' , restrictedToAdmin,getParentById)
router.put('/admin' , restrictedToAdmin , updateParent)
router.delete('/admin' , restrictedToAdmin , deleteParent)

module.exports = router;
