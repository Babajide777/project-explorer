const Project = require("../models/projectModel");
const { translateError } = require("./mongo_helper");

//create new project
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
const getProjectById = async (id) => await Project.findById(id);

// Return all projects
const getAll = async () => await Project.find();

// get four most recent projects.
const getLastFourProjects = async () =>
  await Project.find().sort({ createdAt: -1 }).limit(4);

const getProjectsUsingSearch = async (searchterm, searchtype, page) => {};

module.exports = {
  getAll,
  createNewProject,
  getProjectById,
  getLastFourProjects,
  getProjectsUsingSearch,
};
