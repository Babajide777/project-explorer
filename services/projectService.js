const Project = require("../models/projectModel");
const { translateError } = require("./mongo_helper");

//create new project
const createNewProject = async ({
  name,
  abstract,
  authors,
  tags,
  createdBy,
}) => {
  try {
    const project = new Project({ name, abstract, authors, tags, createdBy });
    if (await project.save()) {
      return [true, project];
    }
  } catch (e) {
    return [false, translateError(e)];
  }
};

// Return project with specified id
const getProjectById = async (id) => await Project.findById(id);

// Return all projects
const getAll = async () => await Project.find();

// get four most recent projects.
const getLastFourProjects = async () =>
  await Project.find().sort({ createdAt: -1 }).limit(4);

const getProjectsUsingSearch = async (searchterm, searchtype, page) => {
  try {
    if (searchterm && searchtype) {
      let query;
      switch (searchtype) {
        case "name":
          query = { name: { $regex: `${searchterm}`, $options: "i" } };
          break;
        case "abstract":
          query = { abstract: { $regex: `${searchterm}`, $options: "i" } };
          break;
        case "authors":
          query = { authors: { $regex: `${searchterm}`, $options: "i" } };
          break;
        case "tags":
          query = { tags: { $regex: `${searchterm}`, $options: "i" } };
          break;
      }

      let pageLimit = 8;
      let offSetValue = (page - 1) * pageLimit;

      const returnedSearchResult = await Project.find(query)
        .skip(offSetValue)
        .limit(pageLimit);

      const totalSearchCount = await Project.find(query).countDocuments();

      const searchPages = Math.ceil(totalSearchCount / pageLimit);

      const field = {
        returnedSearchResult,
        totalSearchCount,
        searchPages,
      };

      if (totalSearchCount <= 0) {
        return [false, "There's no project matching your search query"];
      } else {
        return [true, field];
      }
    } else {
      throw [false, "query incomplete"];
    }
  } catch (error) {
    return [false, translateError(error)];
  }
};

module.exports = {
  getAll,
  createNewProject,
  getProjectById,
  getLastFourProjects,
  getProjectsUsingSearch,
};
