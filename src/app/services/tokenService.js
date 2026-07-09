import tokenModel from '../models/token'

const createToken = ({ identity, roomName, participantName }) => tokenModel.create({
  identity,
  roomName,
  participantName,
})

export default {
  createToken,
}
