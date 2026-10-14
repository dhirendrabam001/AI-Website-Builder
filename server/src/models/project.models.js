const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema(
  {
    path: { type: String, required: true },
    content: { type: String, default: "" },
  },
  { _id: false },
);

const messageSchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

// Snapshot of every file after a turn — powers Undo.
const versionSchema = new mongoose.Schema(
  {
    label: { type: String, default: "" },
    files: { type: [fileSchema], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

const projectSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String, trim: true, maxlength: 120, default: "Untitled site" },
    prompt: { type: String, required: true, trim: true },
    files: { type: [fileSchema], default: [] },
    messages: { type: [messageSchema], default: [] },
    versions: { type: [versionSchema], default: [] },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

module.exports = { Project };
