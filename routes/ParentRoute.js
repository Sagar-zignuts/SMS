const router = require("express").Router();
const {
  createParentByAdmin,
  deleteParentByAdmin,
  getParentByAdmin,
  getParentWithIdByAdmin,
  updateParentByAdmin,
  searchParentByAdmin,
} = require("../controllers/ParentController");
const {
  authMiddleware,
  restrictedTo,
} = require("../middlewares/AuthMiddleware");
const { validatParent , validatParentUpdate } = require("../middlewares/Validation");

//Route for parents

//Middleware used for check user is login or not.
router.use(authMiddleware);

router.post("/", restrictedTo("admin"), validatParent, createParentByAdmin);
router.get("/", restrictedTo("admin"), getParentByAdmin);
router.get('/search', restrictedTo('admin'), searchParentByAdmin)
router.get("/:id", restrictedTo("admin"), getParentWithIdByAdmin);
router.put("/:id", restrictedTo("admin"), validatParentUpdate, updateParentByAdmin);
router.delete("/:id", restrictedTo("admin"), deleteParentByAdmin);

module.exports = router;
