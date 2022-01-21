const { getLastFourProjects } = require("../services/projectService");
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

module.exports = {
  getFourRecentProject,
};
