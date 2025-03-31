const bcrypt = require('bcrypt');
const StudentModel = require('../../models/User/students');
const validator = require('validatorjs');
const { Op } = require('sequelize');
const redis = require('../../config/RedisConfig');

//create student by admin
const createStudent = async (req, res) => {
  try {
    const { email, className, school, password } = req.body;
    const profile_pic = req.file ? req.file.path : null;

    const validation = new validator(
      { email, className, school, password },
      {
        email: 'required|email',
        className: 'required',
        school: 'required',
        password: 'required',
      }
    );

    if (validation.fails()) {
      return res
        .status(400)
        .json({ status: 400, message: 'Field is required' });
    }

    const student = await StudentModel.create({
      email,
      className,
      school,
      profile_pic,
      password,
    });
    await redis.setEx(`student:${student.id}`, 3600, JSON.stringify(student));

    return res
      .status(200)
      .json({ status: 200, message: 'Student created', data: student });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'server Error in create student' });
  }
};

//get student by admin
const getAllStudents = async (req, res) => {
  try {
    const { email } = req.query;
    let students;

    if (email) {
      // Search students by email (case-insensitive)
      students = await StudentModel.findAll({
        where: { email: { [Op.like]: `%${email}%` } },
        attributes: [
          'id',
          'email',
          'className',
          'school',
          'profile_pic',
          'createdAt',
        ],
      });

      if (students.length === 0) {
        return res.status(400).json({
          status: 400,
          message: 'No students found with the given email',
        });
      }
    } else {
      // Get all students if no search query is provided
      students = await StudentModel.findAll({
        attributes: [
          'id',
          'email',
          'className',
          'school',
          'profile_pic',
          'createdAt',
        ],
      });

      if (students.length === 0) {
        return res.status(400).json({
          status: 400,
          message: 'No students found',
        });
      }
    }

    return res.status(200).json({
      status: 200,
      message: 'Students retrieved successfully',
      data: students,
    });
  } catch (error) {
    console.error('Error in fetching students:', error);
    return res.status(500).json({
      status: 500,
      message: 'Server error in fetching students',
    });
  }
};

//get student by ID
const getStudentById = async (req, res) => {
  try {
    const { student_id } = req.query;
    const redisKey = `student:${student_id}`;
    const cachedStudent = await redis.get(redisKey);

    if (cachedStudent) {
      return res.status(200).json({
        status: 200,
        message: 'Data fetch',
        data: JSON.parse(cachedStudent),
      });
    }

    const student = await StudentModel.findByPk(student_id, {
      attributes: [
        'id',
        'email',
        'className',
        'school',
        'profile_pic',
        'createdAt',
      ],
    });

    if (!student) {
      return res
        .status(400)
        .json({ status: 400, message: 'student not found' });
    }

    await redis.setEx(redisKey, 3600, JSON.stringify(student));
    return res
      .status(200)
      .json({ status: 200, message: 'Data fetched', data: student });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Server error in data fetch' });
  }
};

//update student by admin
const updateStudent = async (req, res) => {
  try {
    const { email, className, school } = req.body;
    const profile_pic = req.file ? req.file.path : null;

    const { student_id } = req.query;

    if (!student_id) {
      return res
        .status(400)
        .json({ status: 400, message: 'Query parameter is required' });
    }

    const validation = new validator(
      { email, className, school },
      {
        email: 'required|email',
        className: 'required',
        school: 'required',
      }
    );

    if (validation.fails()) {
      return res.status(400).json({
        status: 400,
        message: `Error in validation : ${validation.errors.all()}`,
      });
    }

    if (req.user.role === 'student' && req.user.id !== student_id) {
      return res
        .status(400)
        .json({ status: 400, message: 'You can only update your own profile' });
    }

    const updates = {
      email,
      className,
      school,
      profile_pic,
    };

    const student = await StudentModel.findByPk(student_id);
    if (!student) {
      return res
        .status(400)
        .json({ status: 400, message: 'Student not exiest' });
    }

    const data = await StudentModel.update(updates, {
      where: { id: student_id },
      returning: true,
    });

    await redis.setEx(`student:${student_id}`, 3600, JSON.stringify(data[1]));

    return res
      .status(200)
      .json({ status: 200, message: 'Student updated', data: data });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Server error in data Update' });
  }
};

//Delete student by admin
const deleteStudent = async (req, res) => {
  try {
    const { student_id } = req.query;
    if (!student_id) {
      return res
        .status(400)
        .json({ status: 400, message: 'Query parameter is required' });
    }

    const student = await StudentModel.findByPk(student_id);
    if (!student) {
      return res
        .status(400)
        .json({ status: 400, message: 'Student not found' });
    }

    await redis.del(`student:${student_id}`);
    const data = await student.destroy();
    return res.status(200).json({ status: 200, message: 'Student deleted' });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Server error in data delete' });
  }
};

//search student using email and calssName and school

module.exports = {
  createStudent,
  updateStudent,
  deleteStudent,
  getAllStudents,
  getStudentById,
};
