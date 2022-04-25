const nodemailer = require("nodemailer");
const { getUrl } = require("./userService");
const { google } = require("googleapis");

const NODEMAILER_EMAIL = process.env.NODEMAILER_EMAIL;
const REDIRECT_URI = "https://developers.google.com/oauthplayground";
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const oAuth2Client = new google.auth.OAuth2(
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  REDIRECT_URI
);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

//Create a mail
const createMail = async (email, id) => {
  const accessToken = await oAuth2Client.getAccessToken();

  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: NODEMAILER_EMAIL,
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      refreshToken: REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  let message = {
    from: "OYAFEMI BABAJIDE PROJECT EXPLORER",
    to: email,
    subject: "Reset your Project Explorer Password",
    html: `
    <h3> Hi,</h3>
    <p> Please click on this link to complete your password reset process</p>
    <a href="${getUrl()}resetpassword/${id}"> Click here to reset your password</a>
    `,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(info);
  });
};

module.exports = {
  createMail,
};
