const { getLastFourProjects } = require("../services/projectService");
const { getUserByID } = require("../services/userService");
const { responseHandler } = require("../utils/responseHandler");

const getFourRecentProject = async (req, res) => {
  return responseHandler(
    res,
    "Four most recent projects",
    200,
    true,
    await getLastFourProjects()
  );
};

const getPrograms = (req, res) =>
  responseHandler(res, "All projects", 200, true, [
    "Computer Science",
    "Computer Information Systems",
    "Computer technology",
  ]);

const getGraduationYears = (req, res) =>
  responseHandler(
    res,
    "All graduation years",
    200,
    true,
    [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022]
  );

const headerFunc = async (req, res) => {
  const user = await getUserByID(req.id);
  return responseHandler(res, "Session okay", 200, true, user);
};

module.exports = {
  getFourRecentProject,
  getPrograms,
  getGraduationYears,
  headerFunc,
};
