const { createProjectValidation } = require("../services/validation");

const createProject = async (req, res) => {
  const { details } = await createProjectValidation(req.body);
  console.log(details);
  if (details) {
    let allErrors = details.map((detail) => detail.message.replace(/"/g, ""));
    return responseHandler(res, allErrors, 400, false, "");
  }
};

module.exports = {
  createProject,
};
