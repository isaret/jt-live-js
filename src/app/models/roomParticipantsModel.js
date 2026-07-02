import mongoose from 'mongoose'

import {
  roomParticipantSchema,
} from './schemas'

const model = mongoose.model('room_participant', roomParticipantSchema)

const findOne = (filter = {}) => model.findOne(filter).lean().exec()
const findAll = (filter = {}) => model.find(filter).lean().exec()
const insertMany = (records) => model.insertMany(records)

export default {
  findOne,
  findAll,
  insertMany,
}
