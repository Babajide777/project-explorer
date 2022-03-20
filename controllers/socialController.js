const { checkJwt, getUserByID } = require("../services/userService");
const { responseHandler } = require("../utils/responseHandler");

const facebookAuthentication = (req, res) => {};

const googleAuthentication = async (req, res) => {
  const { token } = req.user;
  let check = await checkJwt(token);
  const { id, err } = check;
  if (err) {
    return responseHandler(res, [err], 403, false, "");
  }
  const assignedUser = await getUserByID(id);
  const { graduationYear, program } = assignedUser;

  return graduationYear === undefined && program === undefined
    ? responseHandler(res, "continue signup", 307, true, token)
    : responseHandler(res, "User socials authenticated", 200, true, token);
};

module.exports = {
  facebookAuthentication,
  googleAuthentication,
};
