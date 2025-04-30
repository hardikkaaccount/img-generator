import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser extends Document {
  username: string;
  password: string;
  remainingPrompts: number;
  submittedPromptsCount: number;
  submissions: mongoose.Types.ObjectId[];
}

const UserSchema: Schema = new Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  remainingPrompts: { 
    type: Number, 
    default: 5 
  },
  submittedPromptsCount: { 
    type: Number, 
    default: 0 
  },
  submissions: [{ 
    type: Schema.Types.ObjectId, 
    ref: 'Submission' 
  }]
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    const password = this.password as string;
    this.password = await bcrypt.hash(password, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Check if model exists before creating it (for Next.js hot reloading)
const User = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User; 