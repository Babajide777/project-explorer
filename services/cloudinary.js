const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

//confiduration for cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//cloudinary stoage settings
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Explorer",
    allowedFormats: ["jpeg", "png", "jpg"],
  },
});

module.exports = {
  storage,
};
