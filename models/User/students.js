const bcrypt = require('bcrypt');
const { sequelize } = require('../../config/Database');
const { DataTypes, UUIDV4, Sequelize } = require('sequelize');

const Student = sequelize.define(
  'Student',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    className: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    school: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profile_pic: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    tableName: 'students',
  }
);

Student.beforeCreate(async (student) => {
  student.password = await bcrypt.hash(student.password, 10);
});

module.exports = Student;
