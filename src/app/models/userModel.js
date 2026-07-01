import mongoose from 'mongoose'

import {
  userSchema,
} from './schemas'

const model = mongoose.model('users', userSchema)

const findOne = (filter = {}) => model.findOne(filter).lean().exec()
const findAll = (filter = {}) => model.find(filter).lean().exec()
const create = (record) => model.findOneAndUpdate(
  { name: record.name },
  { $setOnInsert: record },
  {
    upsert: true,
    new: true,
  },
)

export default {
  findOne,
  findAll,
  create,
}
