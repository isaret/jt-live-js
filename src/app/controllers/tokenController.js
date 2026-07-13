import tokenService from '../services/tokenService'
import roomParticipantsService from '../services/roomParticipantsService'
import { liveConfigs } from '../../config'

const createToken = async (req, res) => {
  const { user, params } = req
  const { roomId } = params
  const { userName } = req.body || {}
  try {
    const userId = user?.flexID?.id
    if (!userId || !roomId || !userName) {
      return res.status(400).json({
        code: 'Bad_Request',
        message: 'Bad Request',
      })
    }

    const participants = await roomParticipantsService.getAllParticipants({ roomId, userId })
    if (!participants || participants.length === 0) {
      return res.status(403).json({
        code: 'Forbidden',
        message: 'User is not a participant in this room',
      })
    }

    const token = await tokenService.createToken({
      identity: userId,
      roomName: roomId,
      participantName: userName,
    })
    return res.status(201).json({ token, host: liveConfigs.host })
  } catch (err) {
    console.log(err)
    return res.status(500).json({ code: 500, message: 'Internal server error' })
  }
}

export default { createToken }