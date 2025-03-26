const {
  getStudentByAdmin,
  getStudentWithIdByAdmin,
  deleteStudentByAdmin,
  updateStudentByAdmin,
  createStudentByadmin,
} = require("../controllers/StudentController");
const {
  authMiddleware,
  restrictedTo,
} = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/Uploads");
const { validatStudent } = require("../middlewares/Validation");

const router = require("express").Router();

router.use(authMiddleware);

router.get("/", restrictedTo("admin"), getStudentByAdmin);
router.get("/:id", restrictedTo("admin"), getStudentWithIdByAdmin);
router.post(
  "/",
  restrictedTo("admin"),
  upload.single("profile_pic"),
  validatStudent,
  createStudentByadmin
);
router.put(
  "/:id",
  restrictedTo("admin"),
  upload.single("profile_pic"),
  validatStudent,
  updateStudentByAdmin
);
router.delete("/:id", restrictedTo("admin"), deleteStudentByAdmin);

module.exports = router;
