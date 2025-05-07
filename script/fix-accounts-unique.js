require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// Function to generate simple but unique passwords
function generateUniquePassword(warriorNumber) {
  // Create an easy-to-remember pattern: warrior + number
  return `pass${warriorNumber}`;
}

async function createAccountsWithUniquePasswords() {
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
    
    // Create 60 warrior accounts with unique passwords
    console.log('Creating 60 warrior accounts with unique passwords...');
    const credentials = [];
    
    // Create account data
    for (let i = 1; i <= 60; i++) {
      const password = generateUniquePassword(i);
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
    console.log(`Created ${createdUsers.length} warrior accounts with unique passwords`);
    
    // Save credentials to CSV
    const csvContent = credentials.map(cred => `${cred.username},${cred.password}`).join('\n');
    fs.writeFileSync('warrior-credentials-unique.csv', 'Username,Password\n' + csvContent);
    
    // Print sample credentials
    console.log('\nSAMPLE CREDENTIALS:');
    console.log(`${credentials[0].username}: ${credentials[0].password}`);
    console.log(`${credentials[1].username}: ${credentials[1].password}`);
    console.log(`${credentials[2].username}: ${credentials[2].password}`);
    
    console.log(`\nPassword pattern: Each warrior has password "pass" followed by their number`);
    console.log('Example: Warrior1 has password pass1, Warrior2 has password pass2, etc.');
    console.log('\nFull credentials list saved to warrior-credentials-unique.csv');
    
    // Verify
    const count = await User.countDocuments();
    console.log(`Verified: ${count} users in the database`);
    
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

createAccountsWithUniquePasswords(); 