require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const fs = require('fs');

// The specific passwords provided by the user
const customCredentials = [
  { username: 'Warrior1', password: 'Storm168' },
  { username: 'Warrior2', password: 'Alpha681' },
  { username: 'Warrior3', password: 'Max712' },
  { username: 'Warrior4', password: 'Comet980' },
  { username: 'Warrior5', password: 'Neo919' },
  { username: 'Warrior6', password: 'Blaze604' },
  { username: 'Warrior7', password: 'Nitro385' },
  { username: 'Warrior8', password: 'Neo225' },
  { username: 'Warrior9', password: 'Comet355' },
  { username: 'Warrior10', password: 'Delta145' },
  { username: 'Warrior11', password: 'Max534' },
  { username: 'Warrior12', password: 'Drift343' },
  { username: 'Warrior13', password: 'Alpha954' },
  { username: 'Warrior14', password: 'Hero578' },
  { username: 'Warrior15', password: 'Blaze823' },
  { username: 'Warrior16', password: 'Alpha453' },
  { username: 'Warrior17', password: 'Hero155' },
  { username: 'Warrior18', password: 'Blaze408' },
  { username: 'Warrior19', password: 'Zoom205' },
  { username: 'Warrior20', password: 'Drift183' },
  { username: 'Warrior21', password: 'Hero244' },
  { username: 'Warrior22', password: 'Zoom360' },
  { username: 'Warrior23', password: 'Blaze171' },
  { username: 'Warrior24', password: 'Nova429' },
  { username: 'Warrior25', password: 'Warp608' },
  { username: 'Warrior26', password: 'Hero468' },
  { username: 'Warrior27', password: 'Pixel541' },
  { username: 'Warrior28', password: 'Storm935' },
  { username: 'Warrior29', password: 'Delta993' },
  { username: 'Warrior30', password: 'Turbo821' },
  { username: 'Warrior31', password: 'Comet147' },
  { username: 'Warrior32', password: 'Drift696' },
  { username: 'Warrior33', password: 'Turbo391' },
  { username: 'Warrior34', password: 'Zoom603' },
  { username: 'Warrior35', password: 'Drift653' },
  { username: 'Warrior36', password: 'Tiger299' },
  { username: 'Warrior37', password: 'Storm963' },
  { username: 'Warrior38', password: 'Tiger950' },
  { username: 'Warrior39', password: 'Frost649' },
  { username: 'Warrior40', password: 'Delta958' },
  { username: 'Warrior41', password: 'Drift121' },
  { username: 'Warrior42', password: 'Neo961' },
  { username: 'Warrior43', password: 'Turbo372' },
  { username: 'Warrior44', password: 'Frost381' },
  { username: 'Warrior45', password: 'Rocket353' },
  { username: 'Warrior46', password: 'Rocket332' },
  { username: 'Warrior47', password: 'Sky162' },
  { username: 'Warrior48', password: 'Pixel730' },
  { username: 'Warrior49', password: 'Warp598' },
  { username: 'Warrior50', password: 'Storm243' },
  // Generate additional credentials for warriors 51-60
  { username: 'Warrior51', password: 'Nova721' },
  { username: 'Warrior52', password: 'Turbo584' },
  { username: 'Warrior53', password: 'Pixel399' },
  { username: 'Warrior54', password: 'Frost267' },
  { username: 'Warrior55', password: 'Tiger428' },
  { username: 'Warrior56', password: 'Rocket512' },
  { username: 'Warrior57', password: 'Sky876' },
  { username: 'Warrior58', password: 'Warp531' },
  { username: 'Warrior59', password: 'Nova642' },
  { username: 'Warrior60', password: 'Alpha329' }
];

async function createAccountsWithCustomPasswords() {
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
    
    // Create 60 warrior accounts with the custom passwords
    console.log('Creating 60 warrior accounts with custom passwords...');
    
    // Create the accounts in the database
    const users = [];
    for (const cred of customCredentials) {
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
    console.log(`Created ${createdUsers.length} warrior accounts with custom passwords`);
    
    // Save credentials to CSV
    const csvContent = customCredentials.map(cred => `${cred.username},${cred.password}`).join('\n');
    fs.writeFileSync('warrior-credentials-custom.csv', 'Username,Password\n' + csvContent);
    
    // Print sample credentials
    console.log('\nSAMPLE CREDENTIALS (custom passwords):');
    console.log(`${customCredentials[0].username}: ${customCredentials[0].password}`);
    console.log(`${customCredentials[1].username}: ${customCredentials[1].password}`);
    console.log(`${customCredentials[2].username}: ${customCredentials[2].password}`);
    
    console.log(`\nPasswords are using the custom format provided (e.g., Storm168, Alpha681, etc.)`);
    console.log('\nFull credentials list saved to warrior-credentials-custom.csv');
    
    // Display all credentials in terminal
    console.log('\n===== FULL CREDENTIALS LIST =====');
    customCredentials.forEach(cred => {
      console.log(`${cred.username}: ${cred.password}`);
    });
    
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    
  } catch (error) {
    console.error('Error creating accounts:', error);
  }
}

createAccountsWithCustomPasswords(); 