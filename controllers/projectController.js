const {
  createNewProject,
  getProjectById,
} = require("../services/projectService");
const { createProjectValidation } = require("../services/validation");
const { responseHandler } = require("../utils/responseHandler");

const createProject = async (req, res) => {
  const { details } = await createProjectValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
  const newProject = await createNewProject(req.body);
  return newProject[0]
    ? responseHandler(
        res,
        ["Project successfully created"],
        201,
        true,
        newProject[1]
      )
    : responseHandler(
        res,
        ["Unable to create project"],
        400,
        false,
        newProject[1]
      );
};

const getProject = async (req, res) => {
  const { id } = req.body;
  const project = await getProjectById(id);
  return project
    ? responseHandler(res, ["Project found"], 200, true, project)
    : responseHandler(res, ["Project not found"], 400, false, "");
};

module.exports = {
  createProject,
  getProject,
};