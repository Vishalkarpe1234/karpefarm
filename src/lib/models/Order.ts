import mongoose, { Schema, Document } from 'mongoose'

export type OrderStatus =
  | 'pending'
  | 'approved'
  | 'coming_soon'
  | 'out_of_stock'
  | 'delivered'
  | 'cannot_deliver'
  | 'cancelled'

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId
  productId: mongoose.Types.ObjectId
  productName: string
  productPrice: number
  quantity: number
  totalAmount: number
  buyerName: string
  buyerPhone: string
  buyerAddress: string
  status: OrderStatus
  adminComment: string
  adminNotes: string
  notificationSent: boolean
  createdAt: Date
  updatedAt: Date
}

const OrderSchema = new Schema<IOrder>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    productName: { type: String, required: true },
    productPrice: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String, required: true },
    buyerAddress: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'coming_soon', 'out_of_stock', 'delivered', 'cannot_deliver', 'cancelled'],
      default: 'pending',
    },
    adminComment: { type: String, default: '' },
    adminNotes: { type: String, default: '' },
    notificationSent: { type: Boolean, default: false },
  },
  { timestamps: true }
)

export default mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema)
