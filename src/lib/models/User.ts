import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  profilePhoto?: string
  role: 'user' | 'admin'
  isActive: boolean
  loginActivity: Array<{ date: Date; ip?: string; device?: string }>
  cart: Array<{ productId: mongoose.Types.ObjectId; quantity: number; addedAt: Date }>
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    phone: { type: String, trim: true },
    address: { type: String },
    profilePhoto: { type: String, default: '' },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isActive: { type: Boolean, default: true },
    loginActivity: [
      {
        date: { type: Date, default: Date.now },
        ip: { type: String },
        device: { type: String },
      },
    ],
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, default: 1 },
        addedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
)

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
