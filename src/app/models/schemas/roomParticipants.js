import mongoose from 'mongoose'

const roomParticipantSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  role: {
    type: String,
    enum: [
      'host',
      'cohost',
      'guest',
      'moderator',
    ],
    required: true,
  },
  status: {
    type: String,
    enum: [
      'invited',   // เชิญแล้ว
      'accepted',  // ตอบรับ
      'declined',  // ปฏิเสธ
      'waiting',   // รอขึ้น Live
      'live',      // กำลังอยู่บน Live
      'left',      // ออกจากห้อง
      'removed',   // ถูกนำออก
    ],
    default: 'invited',
  },

  // ลำดับการขึ้น Live (ใช้กับ Guest)
  queueNo: {
    type: Number,
    default: null,
  },

  // ผู้เชิญ
  invitedBy: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
  },

  // เวลาตอบรับ
  acceptedAt: {
    type: Date,
    default: null,
  },

  // เวลาเข้าห้อง
  joinedAt: {
    type: Date,
    default: null,
  },

  // เวลาออกห้อง
  leftAt: {
    type: Date,
    default: null,
  },

  // หมายเหตุ
  remark: {
    type: String,
    default: '',
  },
}, { timestamps: true, versionKey: false })


// ผู้ใช้ 1 คน อยู่ในห้องเดียวได้เพียง 1 Record
roomParticipantSchema.index(
  {
    roomId: 1,
    userId: 1,
  },
  {
    unique: true,
  }
)

// ใช้ค้นหา Host
roomParticipantSchema.index({
  roomId: 1,
  role: 1,
})

// ใช้ค้นหาคนที่กำลัง Live
roomParticipantSchema.index({
  roomId: 1,
  status: 1,
})

// ใช้เรียง Queue
roomParticipantSchema.index({
  roomId: 1,
  queueNo: 1,
})
export default roomParticipantSchema