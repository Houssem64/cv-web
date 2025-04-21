// Script to update all project image URLs in the database
// Run with: node -r dotenv/config src/scripts/fix-image-urls.js

const mongoose = require('mongoose');
const { Schema } = mongoose;

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('Please define the MONGODB_URI environment variable');
  process.exit(1);
}

// Create Project Schema
const ProjectSchema = new Schema({
  title: String,
  description: String,
  fullDescription: String,
  image: String,
  tags: [String],
  link: String,
  githubLink: String,
  featured: Boolean,
}, { timestamps: true });

// Define the old and new URL patterns
const OLD_URL_PATTERN = 'https://e80ce57811d25de72acb22b3019b25b6.r2.cloudflarestorage.com/cv-web';
const NEW_URL_PATTERN = 'https://pub-e80ce57811d25de72acb22b3019b25b6.r2.dev';

async function main() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Register and use the Project model
    const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
    
    // Find all projects with the old URL pattern
    const projects = await Project.find({ 
      image: { $regex: OLD_URL_PATTERN, $options: 'i' } 
    });
    
    console.log(`Found ${projects.length} projects with old image URLs`);
    
    if (projects.length === 0) {
      console.log('No projects to update');
      await mongoose.disconnect();
      return;
    }
    
    // Update each project
    let updated = 0;
    for (const project of projects) {
      // Extract the filename from the old URL
      const oldUrl = project.image;
      const filename = oldUrl.split('/').pop();
      
      // Create the new URL
      const newUrl = `${NEW_URL_PATTERN}/${filename}`;
      
      console.log(`Updating project: ${project.title}`);
      console.log(`  Old URL: ${oldUrl}`);
      console.log(`  New URL: ${newUrl}`);
      
      // Update the project
      await Project.updateOne(
        { _id: project._id },
        { $set: { image: newUrl } }
      );
      
      updated++;
    }
    
    console.log(`Updated ${updated} projects successfully`);
    console.log('Disconnecting from MongoDB...');
    await mongoose.disconnect();
    console.log('Done!');
    
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main(); 