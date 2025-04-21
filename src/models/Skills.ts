import mongoose, { Schema, Document } from 'mongoose';

export interface ISkill extends Document {
  name: string;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const SkillSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a skill name'],
      trim: true,
    },
    category: {
      type: String,
      default: 'Uncategorized',
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Skill || mongoose.model<ISkill>('Skill', SkillSchema); 