import mongoose from 'mongoose';
import { UserDocument } from './user.model';

export interface SessionInput {
  user: UserDocument['_id'];
  valid: boolean;
}

export interface SessionDocument extends SessionInput, mongoose.Document {
  createdAt: Date;
  updatedAt: Date;
  comparePassword(SessionPassword: string): Promise<boolean>
}

const SessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    userAgent: { 
      type: String
    }
  },
  valid: {
    type: Boolean,
    default: true
  },
},{
  timestamps: true,
});


const SessionModel = mongoose.model<SessionDocument>("Session", SessionSchema);

export default SessionModel;
