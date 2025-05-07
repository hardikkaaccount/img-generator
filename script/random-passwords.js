require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const crypto = require('crypto');

// Function to generate random, hard-to-guess passwords
function generateStrongPassword(length = 8) {
  // Create a password with mixed characters that's hard to guess
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(length);
  
  for (let i = 0; i < length; i++) {
    const randomIndex = randomBytes[i] % chars.length;
    password += chars.charAt(randomIndex);
  }
  
  return password;
}

async function createAccountsWithRandomPasswords() {
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
    
    // Create 60 warrior accounts with random, hard-to-guess passwords
    console.log('Creating 60 warrior accounts with random passwords...');
    const credentials = [];
    
    // Create account data
    for (let i = 1; i <= 60; i++) {
      const password = generateStrongPassword(10); // 10-character random passwords
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
    console.log(`Created ${createdUsers.length} warrior accounts with random passwords`);
    
    // Save credentials to CSV
    const csvContent = credentials.map(cred => `${cred.username},${cred.password}`).join('\n');
    fs.writeFileSync('warrior-credentials-random.csv', 'Username,Password\n' + csvContent);
    
    // Print sample credentials
    console.log('\nSAMPLE CREDENTIALS (randomly generated):');
    console.log(`${credentials[0].username}: ${credentials[0].password}`);
    console.log(`${credentials[1].username}: ${credentials[1].password}`);
    console.log(`${credentials[2].username}: ${credentials[2].password}`);
    
    console.log(`\nPasswords are randomly generated and include letters, numbers, and special characters`);
    console.log('No password pattern - each is completely unique and hard to guess');
    console.log('\nFull credentials list saved to warrior-credentials-random.csv');
    
    // Display all credentials in terminal
    console.log('\n===== FULL CREDENTIALS LIST =====');
    credentials.forEach(cred => {
      console.log(`${cred.username}: ${cred.password}`);
    });
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error creating accounts:', error);
  }
}

createAccountsWithRandomPasswords(); 