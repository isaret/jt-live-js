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
router.get('/room/:roomId', authenticateToken, controllers.liveRoom.getLiveRoomWithRoomId)

export default router
