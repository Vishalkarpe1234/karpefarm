import mongoose, { Schema, Document } from 'mongoose'

export interface IContact extends Document {
  userId: mongoose.Types.ObjectId
  userName: string
  userEmail: string
  subject: string
  message: string
  status: 'pending' | 'replied' | 'closed'
  adminReply: string
  createdAt: Date
  updatedAt: Date
}

const ContactSchema = new Schema<IContact>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: { type: String, enum: ['pending', 'replied', 'closed'], default: 'pending' },
    adminReply: { type: String, default: '' },
  },
  { timestamps: true }
)

export default mongoose.models.Contact || mongoose.model<IContact>('Contact', ContactSchema)
