require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function checkAccounts() {
  try {
    // Connect to the database
    console.log('Connecting to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Defined' : 'Not defined');
    
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
    
    // Get the model
    const User = mongoose.models.User || mongoose.model('User', UserSchema);
    
    // Check the total count of users
    const userCount = await User.countDocuments();
    console.log(`Found ${userCount} users in the database`);
    
    // Check if Warrior 1 exists
    const warrior = await User.findOne({ username: 'Warrior 1' });
    if (warrior) {
      console.log('Warrior 1 exists!');
      console.log({
        username: warrior.username,
        passwordHash: warrior.password.substring(0, 10) + '...',
        remainingPrompts: warrior.remainingPrompts,
        submittedPromptsCount: warrior.submittedPromptsCount
      });
    } else {
      console.log('Warrior 1 does NOT exist in the database!');
    }
    
    // List all usernames
    console.log('\nListing all users in the database:');
    const allUsers = await User.find().select('username remainingPrompts submittedPromptsCount');
    allUsers.forEach(user => {
      console.log(`- ${user.username} (Prompts: ${user.remainingPrompts}, Submissions: ${user.submittedPromptsCount})`);
    });
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error checking accounts:', error);
  }
}

checkAccounts(); 