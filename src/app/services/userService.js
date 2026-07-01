import userModel from '../models/userModel'

const createUser = (user) => userModel.create(user)
const getAllUsers = () => userModel.findAll()
export default {
  createUser,
  getAllUsers,
}
