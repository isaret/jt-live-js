import mongoose from 'mongoose'

import {
  liveRoomSchema,
} from './schemas'

const model = mongoose.model('rooms', liveRoomSchema)

const findOne = (filter = {}) => model.findOne(filter).lean().exec()
const findAll = (filter = {}) => model.find(filter).lean().exec()
const create = (record) => model.create(record)
const findAllWithUserId = (userId) => model.aggregate([
  {
    $lookup: {
      from: 'room_participants',
      localField: '_id',
      foreignField: 'roomId',
      as: 'participants'
    }
  },
  {
    $match: {
      participants: {
        $elemMatch: {
          userId: new mongoose.Types.ObjectId(userId),
        }
      }
    }
  }
])
export default {
  findOne,
  findAll,
  create,
  findAllWithUserId,
}
