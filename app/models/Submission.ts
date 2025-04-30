import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  imageUrl: string;
  status: 'Submitted' | 'Deleted';
  timestamp: Date;
}

const SubmissionSchema: Schema = new Schema({
  userId: { 
    type: Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  prompt: { 
    type: String, 
    required: true 
  },
  imageUrl: { 
    type: String, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['Submitted', 'Deleted'], 
    default: 'Submitted' 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
});

// Check if model exists before creating it (for Next.js hot reloading)
const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission; 