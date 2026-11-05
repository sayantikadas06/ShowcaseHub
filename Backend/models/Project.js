
const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    tags: [{ type: String, trim: true }],
    githubLink: { type: String, required: true },
    liveDemoLink: { type: String, required: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", projectSchema);
