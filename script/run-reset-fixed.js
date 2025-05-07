const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// Your MongoDB connection string
require('dotenv').config({ path: '.env.local' });

// Import Mongoose and models
const mongoose = require('mongoose');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

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
    // Load schemas
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
    
    // Define models without the middleware that auto-hashes passwords
    // This way we can manually hash them and they won't be double-hashed
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
    
    // Step 3: Create 60 new warrior users with properly hashed passwords
    console.log('Creating 60 new warrior users...');
    const userCredentials = [];
    
    // First, generate all credentials and store the raw passwords for our records
    for (let i = 1; i <= 60; i++) {
      const username = `Warrior ${i}`;
      const plainPassword = generateRandomPassword();
      
      // Store credentials to return them
      userCredentials.push({ username, password: plainPassword });
    }
    
    // Then create users with hashed passwords
    const warriorUsers = [];
    for (const cred of userCredentials) {
      // Hash password the same way the User model would
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(cred.password, salt);
      
      // Create user object with hashed password
      warriorUsers.push({
        username: cred.username,
        password: hashedPassword, // Store the HASHED password in the database
        remainingPrompts: 5,
        submittedPromptsCount: 0,
        submissions: []
      });
    }
    
    // Insert all users at once
    const createdUsers = await User.insertMany(warriorUsers);
    console.log(`Created ${createdUsers.length} new warrior users with properly hashed passwords`);
    
    // Save credentials to file (with plain passwords for reference)
    const csvContent = userCredentials.map(cred => `${cred.username},${cred.password}`).join('\n');
    fs.writeFileSync('warrior-credentials-new.csv', 'Username,Password\n' + csvContent);
    fs.writeFileSync('warrior-credentials-new.json', JSON.stringify(userCredentials, null, 2));
    
    console.log('Database reset successfully');
    console.log('Credentials saved to warrior-credentials-new.csv and warrior-credentials-new.json');
    
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
    const csvPath = path.resolve('./warrior-credentials-new.csv');
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