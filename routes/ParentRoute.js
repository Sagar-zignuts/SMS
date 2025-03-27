// const router = require("express").Router();
// const {
//   createParentByAdmin,
//   deleteParentByAdmin,
//   getParentByAdmin,
//   getParentWithIdByAdmin,
//   updateParentByAdmin,
//   searchParentByAdmin,
// } = require("../controllers/ParentController");
// const {
//   authMiddleware,
//   restrictedTo,
// } = require("../middlewares/AuthMiddleware");
// const { validatParent , validatParentUpdate } = require("../middlewares/Validation");

// //Route for parents

// //Middleware used for check user is login or not.
// router.use(authMiddleware);

// router.post("/", restrictedTo("admin"), validatParent, createParentByAdmin);
// router.get("/", restrictedTo("admin"), getParentByAdmin);
// router.get('/search', restrictedTo('admin'), searchParentByAdmin)
// router.get("/:id", restrictedTo("admin"), getParentWithIdByAdmin);
// router.put("/:id", restrictedTo("admin"), validatParentUpdate, updateParentByAdmin);
// router.delete("/:id", restrictedTo("admin"), deleteParentByAdmin);

const router = require("express").Router();
const {createParent,deleteParent,getParent,getParentById,updateParent} = require('../controllers/ParentController')
const {authMiddleware , restrictedTo} = require("../middlewares/AuthMiddleware")

router.use(authMiddleware)

router.get('/', restrictedTo('admin') , getParent)
router.get('/:id' , restrictedTo('admin'),getParentById)
router.post('/',restrictedTo('admin') , createParent)
router.put('/' , restrictedTo('admin') , updateParent)
router.delete('/' , restrictedTo('admin') , deleteParent)

module.exports = router;
