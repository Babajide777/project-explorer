const mongoose = require("mongoose");
const { Schema } = mongoose;

//project model schema
const ProjectSchema = new Schema(
  {
    name: { type: String, required: true },
    abstract: { type: String, required: true },
    authors: { type: [String], required: true },
    tags: { type: [String], required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    lastVited: Date,
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", ProjectSchema);
module.exports = Project;
