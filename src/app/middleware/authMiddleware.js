import jwt from 'jsonwebtoken'
import { getUserId } from '../libs/flexid'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers.authorization

  // Authorization: Bearer xxxxx
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token required',
    })
  }

  const token = authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token format',
    })
  }
  /*
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token',
      })
    }
    
    req.user = decoded

    next()
  })
  */
  const userId = await getUserId(token)
  //  const decoded = jwt.decode(token)
  req.user = { userId }
  next()
}

export default authenticateToken