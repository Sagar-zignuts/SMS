const { client } = require("../config/PgConfig");
const { createAdmin, findByEmail } = require("../models/admin");
const bcrypt = require("bcrypt");
const sendMail = require("../utils/SendMail");
const jwt = require("jsonwebtoken");
const {
  createStudent,
  getStudent,
  getStudentByMail,
} = require("../models/students");

const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const registerStudent = async (req, res) => {
  const { email, className, school, password } = req.body;
  const profile_pic = req.file?.path; //
  console.log(email, className, school, profile_pic, password);

  if (!email || !className || !school || !profile_pic || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All field are required" });
  }

  try {
    const student = await createStudent(
      email,
      className,
      school,
      profile_pic,
      password
    );
    console.log(student);
    await sendMail(email);
    return res
      .status(200)
      .json({ success: true, message: "student register successfuly" });
  } catch (error) {
    console.log(error);

    return res.status(500).json({ success: false, message: error });
  }
};

const loginStudent = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Field is required at login time" });
  }

  try {
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid format of email",
      });
    }

    const student = await getStudentByMail(email);

    if (!student) {
      return res
        .status(400)
        .json({ success: false, message: "Student not found" });
    }

    const result = await bcrypt.compare(password, student.password);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid password" });
    }
    const token = jwt.sign(
      {
        id: student.id,
        email: student.email,
        role : 'student'
      },
      "sfnNOIEFIUASWIONIOCOIS8CbcnkjsgaNKSbc"
    );
    return res
      .status(200)
      .json({
        success: true,
        message: "welcome Student",
        data: { token, student },
      });
  } catch (error) {}
};

const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All field is required" });
  }
  try {
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid format of email",
      });
    }

    const user = await findByEmail(email);

    if (user.length === 0) {
      return res
        .status(409)
        .json({ success: false, message: "Admin not fount" });
    }
    // console.log(user);

    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res
        .status(400)
        .json({ success: false, message: "Wrong password" });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role : 'admin'
      },
      "sfnNOIEFIUASWIONIOCOIS8CbcnkjsgaNKSbc"
    );

    return res.status(200).json({
      success: false,
      message: "Welcome admin",
      data: { data: user, token },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: `Error in admin login : ${error}` });
  }
};

module.exports = { loginAdmin, registerStudent, loginStudent };
