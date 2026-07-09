import express from 'express'
import controllers from './controllers'
import authenticateToken from './middleware/authMiddleware'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})
router.get('/user', controllers.user.getUsers)
router.put('/user', controllers.user.createUser)
router.put('/room', authenticateToken, controllers.liveRoom.createLiveRoom)
router.get('/room', authenticateToken, controllers.liveRoom.getLiveRoom)
router.put('/room/:roomId', authenticateToken, controllers.liveRoom.updateLiveRoom)
router.post('/room/:roomId/token', authenticateToken, controllers.token.createToken)
router.patch('/room/:roomId/status', authenticateToken, controllers.liveRoom.setLiveRoomStatus)
router.patch('/room/:roomId/participant/:participantUserId/status', authenticateToken, controllers.liveRoom.setParticipantStatus)
router.get('/room/:roomId', authenticateToken, controllers.liveRoom.getLiveRoomWithRoomId)
router.delete('/room/:roomId', authenticateToken, controllers.liveRoom.deleteLiveRoom)

export default router
