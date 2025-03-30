const redis = require('../../config/RedisConfig');
const validator = require('validatorjs');
const ParentModel = require('../../models/User/parents');
const { Op } = require('sequelize');

//create parent by admin
const createParent = async (req, res) => {
  try {
    const { email, name, relation, Student_id } = req.body;

    const validation = new validator(
      { email, name, relation, Student_id },
      {
        email: 'required|email',
        name: 'required',
        relation: 'required|in:father,mother,other',
        Student_id: 'required',
      }
    );
    if (validation.fails()) {
      return res.status(400).json({
        status: 400,
        message: 'Field is required OR somthing entered wrong',
      });
    }

    const parent = await ParentModel.create({
      email,
      name,
      relation,
      Student_id,
    });

    await redis.setEx(`parent:${parent.id}`, 3600, JSON.stringify(parent));
    return res
      .status(200)
      .json({ status: 200, message: 'Parent created', data: parent });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'server Error in create student' });
  }
};

//get parent by admin
const getAllParents = async (req, res) => {
  try {
    const { name } = req.query;
    let parents;

    if (name) {
      // Search parents by name
      parents = await ParentModel.findAll({
        where: { name: { [Op.like]: `%${name}%` } },
        attributes: ['id', 'email', 'name', 'relation', 'Student_id'],
      });

      if (parents.length === 0) {
        return res.status(400).json({
          status: 400,
          message: "No parents found with the given name",
        });
      }
    } else {
      parents = await ParentModel.findAll({
        attributes: ['id', 'email', 'name', 'relation', 'Student_id'],
      });

      if (parents.length === 0) {
        return res.status(400).json({
          status: 400,
          message: "No parents found",
        });
      }
    }

    return res.status(200).json({
      status: 200,
      message: "parents retrieved successfully",
      data: parents,
    });
  } catch (error) {
    console.error("Error in fetching parents:", error);
    return res.status(500).json({
      status: 500,
      message: "Server error in fetching parents",
    });
  }
};

//get parent by admin
const getParentById = async (req, res) => {
  try {
    const { parent_id } = req.query;
    const redisKey = `parent:${parent_id}`;
    const cachedParent = await redis.get(redisKey);

    if (cachedParent) {
      return res.status(200).json({
        status: 200,
        message: 'data fetched',
        data: JSON.parse(cachedParent),
      }); // Return cached data
    }
    const parent = await ParentModel.findByPk(parent_id, {
      attributes: ['id', 'email', 'name', 'relation', 'Student_id'],
    });

    if (!parent) {
      return res.status(400).json({ status: 400, message: 'parent not found' });
    }

    await redis.setEx(redisKey, 3600, JSON.stringify(parent));
    return res
      .status(200)
      .json({ status: 200, message: 'Data fetched', data: parent });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Server error in all data fetch' });
  }
};

//update parent by admin
const updateParent = async (req, res) => {
  try {
    const { parent_id } = req.query;
    const { email, name, relation, Student_id } = req.body;

    const validation = new validator(
      { email, name, relation, Student_id },
      {
        email: 'required|email',
        name: 'required',
        relation: 'required',
        Student_id: 'required',
      }
    );

    if (validation.fails()) {
      return res.status(400).json({
        status: 400,
        message: `Error in validation : ${validation.errors.all()}`,
      });
    }

    const updates = {
      email,
      name,
      relation,
      Student_id,
    };

    const parent = await ParentModel.findByPk(parent_id);
    if (!parent) {
      return res
        .status(400)
        .json({ status: 400, message: 'parent not exiest' });
    }

    const result = await ParentModel.update(updates, {
      where: { id: parent_id },
      returning: true,
    });

    await redis.setEx(`parent:${parent_id}`, 3600, JSON.stringify(result[1]));
    return res
      .status(200)
      .json({ status: 200, message: 'parent updated', data: result });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Server error in update data' });
  }
};

//delete parent by admin
const deleteParent = async (req, res) => {
  try {
    const { parent_id } = req.query;
    const parent = await ParentModel.findByPk(parent_id);
    if (!parent) {
      return res
        .status(400)
        .json({ status: 400, message: 'Parent is not exists' });
    }

    await redis.del(`parent:${parent_id}`);
    await parent.destroy();
    return res.status(200).json({ status: 200, message: 'parent deleted' });
  } catch (error) {
    return res
      .status(500)
      .json({ status: 500, message: 'Server error in update data' });
  }
};

module.exports = {
  createParent,
  getAllParents,
  getParentById,
  deleteParent,
  updateParent,
};
