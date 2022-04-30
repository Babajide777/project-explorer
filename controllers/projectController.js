const {
  createNewProject,
  getProjectById,
  getProjectsUsingSearch,
  updateProjectLastVisted,
} = require("../services/projectService");
const { createProjectValidation } = require("../services/validation");
const { responseHandler } = require("../utils/responseHandler");

//controller to create project
const createProject = async (req, res) => {
  //validate req.body
  const { details } = await createProjectValidation(req.body);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }

  //create new project
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

//controller to get project details
const getProject = async (req, res) => {
  const { id } = req.body;

  //get project detail given id
  const project = await getProjectById(id);
  return project
    ? responseHandler(res, ["Project found"], 200, true, project)
    : responseHandler(res, ["Project not found"], 400, false, "");
};

const projectSearch = async (req, res) => {
  const { searchterm, searchtype, page } = req.query;

  const currentPage = page || 1;

  const searchResult = await getProjectsUsingSearch(
    searchterm,
    searchtype,
    currentPage
  );

  if (searchResult[0]) {
    return responseHandler(
      res,
      "returned searched results",
      200,
      searchResult[0],
      searchResult[1]
    );
  }
  return responseHandler(res, searchResult[1], 400, searchResult[0], "");
};

const projectUpdateLastVisit = async (req, res) => {
  const { id } = req.body;

  (await updateProjectLastVisted(id, Date.now()))
    ? responseHandler(res, ["Project last visited updated"], 200, true, "")
    : responseHandler(
        res,
        ["Project last visited could not be updated"],
        400,
        false,
        ""
      );
};

module.exports = {
  createProject,
  getProject,
  projectSearch,
  projectUpdateLastVisit,
};
