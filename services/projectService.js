const Project = require("../models/projectModel");
const { translateError } = require("./mongo_helper");

const createNewProject = async ({
  name,
  abstract,
  authors,
  tags,
  createdBy,
}) => {
  try {
    const project = new Project({ name, abstract, authors, tags, createdBy });
    if (await project.save()) {
      return [true, project];
    }
  } catch (e) {
    return [false, translateError(e)];
  }
};

// Return project with specified id
const getById = async (id) => await Project.findById(id);

// Return all projects
const getAll = async () => await Project.find();

// get four most recent projects.
const getLastFourProjects = async () =>
  await Project.find().sort({ createdAt: -1 }).limit(4);

module.exports = {
  getAll,
  createNewProject,
  getById,
  getLastFourProjects,
};
