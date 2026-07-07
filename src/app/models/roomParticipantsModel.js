import mongoose from 'mongoose'

import {
  roomParticipantSchema,
} from './schemas'

const model = mongoose.model('room_participant', roomParticipantSchema)

const findOne = (filter = {}) => model.findOne(filter).lean().exec()
const findAll = (filter = {}) => model.find(filter).lean().exec()
const insertMany = (records) => model.insertMany(records)
const deleteMany = (filter) => model.deleteMany(filter)
const updateMany = (filter, update) => model.updateMany(filter, update)

export default {
  findOne,
  findAll,
  insertMany,
  deleteMany,
  updateMany,
}
