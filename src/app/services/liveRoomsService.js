import liveRoomsModel from '../models/liveRoomsModel'

const createLiveRoom = (user) => liveRoomsModel.create(user)
const getAllLiveRooms = (filter = {}) => liveRoomsModel.findAll(filter)
export default {
  createLiveRoom,
  getAllLiveRooms,
}
