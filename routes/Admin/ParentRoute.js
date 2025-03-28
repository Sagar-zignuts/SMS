const router = require("express").Router();
const {createParent,deleteParent,getAllParent,getParentById,updateParent,searchParents} = require('../../controllers/Admin/ParentController')
const {authMiddleware , restrictedTo} = require("../../middlewares/AuthMiddleware")

router.use(authMiddleware)

router.get('/' , restrictedTo('admin'),getParentById)
router.get('/parents', restrictedTo('admin') , getAllParent)
router.get('/search' , restrictedTo('admin' , 'student') , searchParents)
router.post('/',restrictedTo('admin') , createParent)
router.put('/' , restrictedTo('admin') , updateParent)
router.delete('/' , restrictedTo('admin') , deleteParent)

module.exports = router;
