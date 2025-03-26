const router = require("express").Router();
const {
  createParentByAdmin,
  deleteParentByAdmin,
  getParentByAdmin,
  getParentWithIdByAdmin,
  updateParentByAdmin,
} = require("../controllers/ParentController");
const {
  authMiddleware,
  restrictedTo,
} = require("../middlewares/AuthMiddleware");
const { validatParent , validatParentUpdate } = require("../middlewares/Validation");

router.use(authMiddleware);

router.post("/", restrictedTo("admin"), validatParent, createParentByAdmin);
router.get("/", restrictedTo("admin"), getParentByAdmin);
router.get("/:id", restrictedTo("admin"), getParentWithIdByAdmin);
router.put("/:id", restrictedTo("admin"), validatParentUpdate, updateParentByAdmin);
router.delete("/:id", restrictedTo("admin"), deleteParentByAdmin);

module.exports = router;
