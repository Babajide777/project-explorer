const Project = require("../models/projectModel");
const { translateError } = require("../models/mongo_helper");

const create = async ({ name, abstract, authors, tags, createdBy }) => {
  try {
    const project = new Project({ name, abstract, authors, tags, createdBy });
    if (await project.save()) {
      return [true, project];
    }
  } catch (e) {
    return [false, translateError(e)];
  }
};

/* Return project with specified id */
const getById = async (id) => {
  // populate projects with data from file.
  return await Project.findById(id);
};
/* Return all projects */
const getAll = async () => {
  // populate projects with data from file.
  return await Project.find();
};

// get latest four projects.
const getLastFourProjects = async () => {
  return await Project.find().sort({ createdAt: -1 }).limit(4);
};

module.exports = {
  getAll,
  create,
  getById,
  getLastFourProjects,
};
