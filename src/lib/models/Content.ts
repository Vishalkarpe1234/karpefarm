import mongoose, { Schema, Document } from 'mongoose'

export interface IContent extends Document {
  section: string
  title: string
  subtitle: string
  description: string
  image: string
  extraData: Record<string, unknown>
  updatedAt: Date
}

const ContentSchema = new Schema<IContent>(
  {
    section: { type: String, required: true, unique: true },
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, default: '' },
    extraData: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
)

export default mongoose.models.Content || mongoose.model<IContent>('Content', ContentSchema)
