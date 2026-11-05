
const Project = require("../models/Project");

const validURL = (value) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

// Student submits a project
exports.submitProject = async (req, res) => {
  try {
    const {
      title,
      studentName,
      description,
      tags,
      githubLink,
      liveDemoLink,
    } = req.body;

    if (
      !title ||
      !studentName ||
      !description ||
      !githubLink ||
      !liveDemoLink
    ) {
      return res.status(400).json({
        message: "Please fill in all required fields",
      });
    }

    if (!validURL(githubLink) || !validURL(liveDemoLink)) {
      return res.status(400).json({
        message: "Please enter valid GitHub and Live Demo URLs",
      });
    }

    const project = await Project.create({
      title,
      studentName,
      description,
      tags: Array.isArray(tags)
        ? tags
        : (tags || "").split(",").map((tag) => tag.trim()).filter(Boolean),
      githubLink,
      liveDemoLink,
    });

    res.status(201).json({
      message: "Project submitted successfully. Waiting for admin approval.",
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Project submission failed" });
  }
};

// Public gallery: approved projects only
exports.getApprovedProjects = async (req, res) => {
  try {
    const { search, tag } = req.query;
    const filter = { status: "Approved" };

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    if (tag) {
      filter.tags = { $regex: tag, $options: "i" };
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch projects" });
  }
};

// Admin: view submissions
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Unable to fetch submissions" });
  }
};

// Admin: approve or reject
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid project status" });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: `Project ${status.toLowerCase()} successfully`,
      project,
    });
  } catch (error) {
    res.status(500).json({ message: "Unable to update project status" });
  }
};
