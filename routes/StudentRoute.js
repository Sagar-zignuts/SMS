const {
  getStudentByAdmin,
  getStudentWithIdByAdmin,
  deleteStudentByAdmin,
  updateStudentByAdmin,
  createStudentByadmin,
  searchStudentByAdmin,
} = require("../controllers/StudentController");
const {
  authMiddleware,
  restrictedTo,
} = require("../middlewares/AuthMiddleware");
const upload = require("../middlewares/Uploads");
const { validatStudent } = require("../middlewares/Validation");


const router = require("express").Router();

//Middleware used for check user is login or not.
router.use(authMiddleware);

//route for students
router.get("/", restrictedTo("admin"), getStudentByAdmin);
router.get('/search' , restrictedTo('admin') , searchStudentByAdmin)
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
