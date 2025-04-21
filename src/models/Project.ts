import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  fullDescription: string;
  featuredImage: string;
  image?: string; // Keep for backward compatibility
  images: string[];
  tags: string[];
  link?: string;
  githubLink?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Create a schema that doesn't include 'image' at all, to avoid validation rules
const ProjectSchema: Schema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for the project'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a short description for the project'],
      trim: true,
      maxlength: [500, 'Description cannot be more than 500 characters'],
    },
    fullDescription: {
      type: String,
      required: [true, 'Please provide a full description for the project'],
      trim: true,
    },
    featuredImage: {
      type: String,
      required: [true, 'Please provide a featured image for the project'],
    },
    images: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      required: [true, 'Please provide at least one tag'],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Please provide at least one tag',
      },
    },
    link: {
      type: String,
      trim: true,
    },
    githubLink: {
      type: String,
      trim: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Remove any collection to force a rebuild
if (mongoose.models.Project) {
  delete mongoose.models.Project;
}

export default mongoose.model<IProject>('Project', ProjectSchema); 