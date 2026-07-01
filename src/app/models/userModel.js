import mongoose from 'mongoose'

import {
    userSchema,
} from './schemas'

const model = mongoose.model('users', userSchema)

const findOne = (filter = {}) => model.findOne(filter).lean().exec()
const findAll = (filter = {}) => model.find(filter).lean().exec()
const create = (record) => model.create(record)

export default {
    findOne,
    findAll,
    create,
}
