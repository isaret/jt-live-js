import roomParticipantsModel from '../models/roomParticipantsModel'

const insertParticipants = (records) => roomParticipantsModel.insertMany(records)
const deleteParticipants = (filter) => roomParticipantsModel.deleteMany(filter)
const updateParticipants = (filter, update) => roomParticipantsModel.updateMany(filter, update)
const getAllParticipants = (filter = {}) => roomParticipantsModel.findAll(filter)
export default {
  insertParticipants,
  deleteParticipants,
  updateParticipants,
  getAllParticipants,
}
