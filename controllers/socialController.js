const facebookAuthentication = (req, res) => {};

const googleAuthentication = async (req, res) => {
  const { token } = req.user;
  res.redirect(`http://localhost:3000/continuesignup/${token}`);
};

module.exports = {
  facebookAuthentication,
  googleAuthentication,
};
