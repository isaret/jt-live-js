import express from 'express'
import controllers from './controllers'

const router = express.Router()

router.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})
router.get('/user', controllers.user.getUsers)
router.put('/user', controllers.user.createUser)

export default router
