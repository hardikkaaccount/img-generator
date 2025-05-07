const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Your MongoDB connection string
require('dotenv').config({ path: '.env.local' });

// Import Mongoose and models
const mongoose = require('mongoose');
const crypto = require('crypto');

// Function to generate random password
function generateRandomPassword(length = 10) {
  return crypto.randomBytes(Math.ceil(length/2))
    .toString('hex')
    .slice(0, length);
}

// Connect to MongoDB
async function connectToDatabase() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    return true;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    return false;
  }
}

// Reset database function
async function resetDatabase() {
  try {
    // Load models
    const UserSchema = new mongoose.Schema({
      username: { type: String, required: true, unique: true },
      password: { type: String, required: true },
      remainingPrompts: { type: Number, default: 5 },
      submittedPromptsCount: { type: Number, default: 0 },
      submissions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Submission' }]
    }, { timestamps: true });
    
    const SubmissionSchema = new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      prompt: { type: String, required: true },
      imageUrl: { type: String, required: true },
      status: { type: String, enum: ['Submitted', 'Deleted'], default: 'Submitted' },
      timestamp: { type: Date, default: Date.now }
    }, { timestamps: true });
    
    // Define models
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
    
    // Step 1: Delete all submissions
    console.log('Deleting all submissions...');
    const deletedSubmissions = await Submission.deleteMany({});
    console.log(`Deleted ${deletedSubmissions.deletedCount} submissions`);
    
    // Step 2: Delete all users
    console.log('Deleting all users...');
    const deletedUsers = await User.deleteMany({});
    console.log(`Deleted ${deletedUsers.deletedCount} users`);
    
    // Step 3: Create 60 new warrior users
    console.log('Creating 60 new warrior users...');
    const warriorUsers = [];
    const userCredentials = [];
    
    for (let i = 1; i <= 60; i++) {
      const username = `Warrior ${i}`;
      const password = generateRandomPassword();
      
      // Store credentials to return them
      userCredentials.push({ username, password });
      
      // Create user in database
      warriorUsers.push({
        username,
        password,
        remainingPrompts: 5,
        submittedPromptsCount: 0,
        submissions: []
      });
    }
    
    // Insert all users at once
    const createdUsers = await User.insertMany(warriorUsers);
    console.log(`Created ${createdUsers.length} new warrior users`);
    
    // Save credentials to file
    const csvContent = userCredentials.map(cred => `${cred.username},${cred.password}`).join('\n');
    fs.writeFileSync('warrior-credentials.csv', 'Username,Password\n' + csvContent);
    fs.writeFileSync('warrior-credentials.json', JSON.stringify(userCredentials, null, 2));
    
    console.log('Database reset successfully');
    console.log('Credentials saved to warrior-credentials.csv and warrior-credentials.json');
    
    // Also print the first few credentials for quick reference
    console.log('\nSample credentials (first 5 warriors):');
    userCredentials.slice(0, 5).forEach(cred => {
      console.log(`${cred.username}: ${cred.password}`);
    });
    
    return userCredentials;
  } catch (error) {
    console.error('Error resetting database:', error);
    throw error;
  }
}

// Run the script
async function run() {
  try {
    const connected = await connectToDatabase();
    if (!connected) {
      console.error('Failed to connect to database. Aborting.');
      process.exit(1);
    }
    
    await resetDatabase();
    
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
    // Try to open the CSV file
    console.log('\nOpening CSV file...');
    const csvPath = path.resolve('./warrior-credentials.csv');
    try {
      if (process.platform === 'win32') {
        exec(`start "" "${csvPath}"`);
      } else if (process.platform === 'darwin') {
        exec(`open "${csvPath}"`);
      } else {
        exec(`xdg-open "${csvPath}"`);
      }
    } catch (e) {
      console.log('Could not automatically open the CSV file.');
    }
    
    console.log('Done!');
  } catch (error) {
    console.error('Script failed:', error);
  }
}

run(); 