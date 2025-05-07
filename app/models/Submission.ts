import mongoose, { Schema, Document } from 'mongoose';

export interface ISubmission extends Document {
  userId: mongoose.Types.ObjectId;
  prompt: string;
  imageUrl: string;
  status: 'Submitted' | 'Deleted';
  timestamp: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SubmissionSchema = new Schema({
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
}, {
  timestamps: true
});

// Add index for createdAt to improve sorting performance
SubmissionSchema.index({ createdAt: -1 });

// Check if model exists and create only if it doesn't (for Hot Reloading)
const Submission = mongoose.models.Submission || mongoose.model<ISubmission>('Submission', SubmissionSchema);

export default Submission; 