import liveRoomsModel from '../models/liveRoomsModel'

const createLiveRoom = (user) => liveRoomsModel.create(user)
const getAllLiveRooms = (filter = {}) => liveRoomsModel.findAll(filter)
const getLiveRoomsWithUserId = (userId) => liveRoomsModel.findAllWithUserId(userId)
export default {
  createLiveRoom,
  getAllLiveRooms,
  getLiveRoomsWithUserId,
}
