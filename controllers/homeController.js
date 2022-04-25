const { getLastFourProjects } = require("../services/projectService");
const { getUserByID } = require("../services/userService");
const { responseHandler } = require("../utils/responseHandler");

//controller to get last 4 projects
const getFourRecentProject = async (req, res) => {
  return responseHandler(
    res,
    "Four most recent projects",
    200,
    true,
    await getLastFourProjects()
  );
};

//controller to get all programs
const getPrograms = (req, res) =>
  responseHandler(res, "All projects", 200, true, [
    "Computer Science",
    "Computer Information Systems",
    "Computer technology",
  ]);

//controller to get all graduation years
const getGraduationYears = (req, res) =>
  responseHandler(
    res,
    "All graduation years",
    200,
    true,
    [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
  );

//controller to get user details
const headerFunc = async (req, res) => {
  //check if user is in the database given the id
  const user = await getUserByID(req.id);
  return responseHandler(res, "Session okay", 200, true, user);
};

module.exports = {
  getFourRecentProject,
  getPrograms,
  getGraduationYears,
  headerFunc,
};
