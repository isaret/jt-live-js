import liveRoomsModel from '../models/liveRoomsModel'

const createLiveRoom = (user) => liveRoomsModel.create(user)
const updateLiveRoom = (roomId, data) => liveRoomsModel.update(roomId, data)
const deleteLiveRoom = (roomId) => liveRoomsModel.deleteOne({ _id: roomId })
const getAllLiveRooms = (filter = {}) => liveRoomsModel.findAll(filter)
const getLiveRoomsWithUserId = (userId) => liveRoomsModel.findAllWithUserId(userId)
const getLiveRoomWithRoomId = (roomId) => liveRoomsModel.findWithRoomId(roomId)
export default {
  createLiveRoom,
  getAllLiveRooms,
  getLiveRoomsWithUserId,
  getLiveRoomWithRoomId,
  updateLiveRoom,
  deleteLiveRoom,
}
