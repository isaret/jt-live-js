import mongoose from 'mongoose'

const liveRoomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'draft',
      'scheduled',
      'preparing',
      'live',
      'ended',
      'cancelled',
    ],
    default: 'draft',
  },
  // เวลาเริ่มตามแผน
  scheduledStartAt: {
    type: Date,
    required: true,
  },

  // เวลาจบตามแผน
  scheduledEndAt: {
    type: Date,
    default: null,
  },

  // เวลาเริ่มจริง
  actualStartAt: {
    type: Date,
    default: null,
  },

  // เวลาจบจริง
  actualEndAt: {
    type: Date,
    default: null,
  },

  // ผู้สร้างห้อง
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  // Host หลัก
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },

  // Guest ที่กำลัง Live อยู่
  currentGuestId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

}, { timestamps: true, versionKey: false })

liveRoomSchema.index({ status: 1 });
liveRoomSchema.index({ scheduledStartAt: 1 });
liveRoomSchema.index({ hostId: 1 });
liveRoomSchema.index({ createdBy: 1 });
liveRoomSchema.index({ title: 'text' });

export default liveRoomSchema