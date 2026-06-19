import mongoose, { Schema, Document } from 'mongoose'

export interface INotification extends Document {
  userId: mongoose.Types.ObjectId
  orderId?: mongoose.Types.ObjectId
  title: string
  message: string
  type: 'order' | 'system' | 'promo'
  isRead: boolean
  createdAt: Date
}

const NotificationSchema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    orderId: { type: Schema.Types.ObjectId, ref: 'Order' },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['order', 'system', 'promo'], default: 'order' },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.Notification || mongoose.model<INotification>('Notification', NotificationSchema)
