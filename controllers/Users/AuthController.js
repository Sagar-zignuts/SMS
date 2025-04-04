const StudentModel = require('../../models/User/students');
const validator = require('validatorjs');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendMail = require('../../utils/SendMail');

const loginStudent = async (req, res) => {
  try {
    const validation = new validator(req.body, {
      email: 'required|email',
      password: 'required',
    });
    if (validation.fails()) {
      return res
        .status(400)
        .json({ status: 400, message: 'All field required' });
    }

    const { email, password } = req.body;
    const student = await StudentModel.findOne({ where: { email } });
    if (!student) {
      return res.status(400).json({ status: 400, message: 'Wrong email' });
    }

    const result = await bcrypt.compare(password, student.dataValues.password);
    if (!result) {
      return res
        .status(400)
        .json({ status: 400, message: 'password is wrong' });
    }

    const token = jwt.sign(
      {
        id: student.id,
        role: 'student',
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '1h' }
    );
    return res.status(200).json({ status: 200, data: { student, token } });
  } catch (error) {
    return res.status(500).json({
      status: 500,
      message: 'Error in server side Authcontroller in user',
    });
  }
};

const registerStudent = async (req, res) => {
  try {
    const { email, className, school, password } = req.body;
    const profile_pic = req.file ? req.file.path : null;

    const validation = new validator(req.body, {
      email: 'required|email',
      className: 'required',
      school: 'required',
      password: 'required|min:7',
    });

    if (validation.fails()) {
      return res
        .status(400)
        .json({ status: 400, message: 'All field required' });
    }

    const student = await StudentModel.findOne({ where: { email } });

    if (student) {
      return res
        .status(400)
        .json({ status: 400, message: 'student already there' });
    }

    const result = await StudentModel.create({
      email,
      className,
      school,
      profile_pic,
      password,
    });

    await sendMail(email);

    return res.status(200).json({
      status: 200,
      message: 'Student register successfully',
      data: result,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Server error in registr the student.' });
  }
};

module.exports = { loginStudent, registerStudent };
