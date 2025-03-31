const { sequelize } = require('../../config/Database');
const { DataTypes, Sequelize } = require('sequelize');
const Student = require('./students');

const Parent = sequelize.define(
  'Parent',
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
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    relation: {
      type: DataTypes.ENUM('father', 'mother', 'other'),
      allowNull: false,
    },
    Student_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Student,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    timestamps: true,
    tableName: 'parents',
  }
);

Parent.belongsTo(Student, { foreignKey: 'student_id' });
Student.hasMany(Parent, { foreignKey: 'student_id' });

module.exports = Parent;
