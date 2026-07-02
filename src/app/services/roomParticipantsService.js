import roomParticipantsModel from '../models/roomParticipantsModel'

const insertParticipants = (records) => roomParticipantsModel.insertMany(records)
const getAllParticipants = (filter = {}) => roomParticipantsModel.findAll(filter)
export default {
  insertParticipants,
  getAllParticipants,
}
