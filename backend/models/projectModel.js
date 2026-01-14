import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['embedded', 'hardware', 'web', 'automation', 'prototype']
  },
  description: {
    type: String,
    required: true
  },
  fullDescription: {
    type: String,
    required: true
  },
  technologies: {
    type: [String],
    required: true
  },
  image: {
    type: [String],
    required: true
  },
  challenges: {
    type: String
  },
  results: {
    type: String
  },
  client: {
    type: String
  },
  duration: {
    type: String
  },
  gallery: {
    type: [String]
  },
  featured: {
    type: Boolean,
    default: false
  },
  completionDate: {
    type: Date
  }
}, {
  timestamps: true
});

const projectModel = mongoose.models.project || mongoose.model("project", projectSchema);

export default projectModel;