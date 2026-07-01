import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  avatar: String,
}, { timestamps: true, versionKey: false })

userSchema.index({ name: 1 }, { unique: true })
export default userSchema