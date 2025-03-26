const { body, validationResult } = require("express-validator");

//validate the student

const validatStudent = [
  body("email").notEmpty().withMessage("Mail field should not be empty"),
  body("password")
    .notEmpty()
    .withMessage("Passsword field should not be empty"),
  body("className")
    .notEmpty()
    .withMessage("ClassName field should not be empty"),
  body("school").notEmpty().withMessage("School field should not be empty"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed student", errors: errors.array() });
    }
    next();
  },
];


//validate the parent when admin try to update parent

const validatParentUpdate = [
  body('name').notEmpty().withMessage("Name is required"),
  body("relation").notEmpty().withMessage("Relation is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed student", errors: errors.array() });
    }
    next();
  },
];


//validate the parent

const validatParent = [
  body("student_id")
    .notEmpty()
    .withMessage("Student ID is required")
    .isInt()
    .withMessage("Student ID must be an integer"),
  body("relation").notEmpty().withMessage("Relation is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format"),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: "Validation failed student", errors: errors.array() });
    }
    next();
  },
];

module.exports = { validatStudent, validatParent ,validatParentUpdate };
