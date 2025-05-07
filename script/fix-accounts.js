require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Function to generate simple passwords
function generateSimplePassword() {
  // Create a very simple password pattern (easy to type)
  return 'test123';
}

async function fixAccounts() {
  try {
    // Connect to the database
    console.log('Connecting to MongoDB...');
    
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    // Define user schema
    const UserSchema = new mongoose.Schema({
      username: String,
      password: String,
      remainingPrompts: Number,
      submittedPromptsCount: Number,
      submissions: Array
    });
    
    // Define submission schema
    const SubmissionSchema = new mongoose.Schema({
      userId: mongoose.Schema.Types.ObjectId,
      prompt: String,
      imageUrl: String,
      status: String,
      timestamp: Date
    });
    
    // Get the models
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    const Submission = mongoose.models.Submission || mongoose.model('Submission', SubmissionSchema);
    
    // Delete all existing submissions
    console.log('Deleting all submissions...');
    const deletedSubmissions = await Submission.deleteMany({});
    console.log(`Deleted ${deletedSubmissions.deletedCount} submissions`);
    
    // Delete all existing users
    console.log('Deleting all users...');
    const deletedUsers = await User.deleteMany({});
    console.log(`Deleted ${deletedUsers.deletedCount} users`);
    
    // Create 60 warrior accounts with SAME password for simplicity
    console.log('Creating 60 warrior accounts...');
    const credentials = [];
    
    // Create account data
    for (let i = 1; i <= 60; i++) {
      const password = generateSimplePassword();
      
      // We'll use a standardized format - either all with spaces or all without
      // Let's use "Warrior1", "Warrior2", etc. (NO space)
      const username = `Warrior${i}`;
      
      credentials.push({ username, password });
    }
    
    // Create the accounts in the database
    const users = [];
    for (const cred of credentials) {
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(cred.password, salt);
      
      users.push({
        username: cred.username,
        password: hashedPassword,
        remainingPrompts: 5,
        submittedPromptsCount: 0,
        submissions: []
      });
    }
    
    // Insert all users
    const createdUsers = await User.insertMany(users);
    console.log(`Created ${createdUsers.length} warrior accounts`);
    
    // Save credentials to CSV
    const csvContent = credentials.map(cred => `${cred.username},${cred.password}`).join('\n');
    fs.writeFileSync('final-credentials.csv', 'Username,Password\n' + csvContent);
    
    // Print sample credentials
    console.log('\nSAMPLE CREDENTIALS (all accounts use the same password for simplicity):');
    console.log(`Username: ${credentials[0].username}`);
    console.log(`Password: ${credentials[0].password}`);
    
    console.log('\nAll usernames follow the pattern: Warrior1, Warrior2, ..., Warrior60');
    console.log('All passwords are the same: test123');
    console.log('\nCredentials saved to final-credentials.csv');
    
    // Verify
    const count = await User.countDocuments();
    console.log(`Verified: ${count} users in the database`);
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error fixing accounts:', error);
  }
}

fixAccounts(); 