import mongoose, { Schema, Document } from 'mongoose';

export interface IContact extends Document {
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  github?: string;
  updatedAt: Date;
}

const ContactSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide an email address'],
      trim: true,
      default: 'contact@example.com'
    },
    phone: {
      type: String,
      trim: true,
      default: '+216 12 345 678'
    },
    location: {
      type: String,
      trim: true,
      default: 'Tunisia'
    },
    linkedin: {
      type: String,
      trim: true,
      default: 'https://linkedin.com/in/houssem-mehouachi/'
    },
    github: {
      type: String,
      trim: true,
      default: 'https://github.com/Houssem64'
    }
  },
  { timestamps: true }
);

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema); 