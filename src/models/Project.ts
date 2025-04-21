import mongoose, { Schema, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: string;
  fullDescription: string;
  image: string;
  tags: string[];
  link?: string;
  githubLink?: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

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
    image: {
      type: String,
      required: [true, 'Please provide an image for the project'],
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

export default mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema); 