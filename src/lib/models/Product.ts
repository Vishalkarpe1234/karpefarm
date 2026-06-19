import mongoose, { Schema, Document } from 'mongoose'

export interface IProduct extends Document {
  name: string
  description: string
  price: number
  unit: string
  image: string
  category: string
  stock: number
  rating: number
  reviews: number
  isFeatured: boolean
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    unit: { type: String, default: 'kg' },
    image: { type: String, required: true },
    category: { type: String, required: true, enum: ['vegetable', 'fruit', 'grain', 'dairy', 'spice', 'other'] },
    stock: { type: Number, default: 100 },
    rating: { type: Number, default: 4, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
)

export default mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema)
