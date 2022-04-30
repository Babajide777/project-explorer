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

// search for projects with a term in it
const getProjectsUsingSearch = async (searchterm, searchtype, page) => {
  try {
    // check if searchterm and type are sent
    if (searchterm && searchtype) {
      let query;

      // set query expression
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

      // number of project to be returned
      let pageLimit = 8;

      // search offset
      let offSetValue = (page - 1) * pageLimit;

      // returned search result
      const returnedSearchResult = await Project.find(query)
        .skip(offSetValue)
        .limit(pageLimit);

      // seach count
      const totalSearchCount = await Project.find(query).countDocuments();

      // number of pages returned
      const searchPages = Math.ceil(totalSearchCount / pageLimit);

      // set fields to return
      const field = {
        returnedSearchResult,
        totalSearchCount,
        searchPages,
        currentPage: page,
        searchterm,
        searchtype,
      };

      // check if any search result is returned
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

// update last visited date
const updateProjectLastVisted = async (id, lastVited) =>
  await Project.findByIdAndUpdate(id, { lastVited }, { new: true });

module.exports = {
  getAll,
  createNewProject,
  getProjectById,
  getLastFourProjects,
  getProjectsUsingSearch,
  updateProjectLastVisted,
};
