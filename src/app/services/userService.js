import userModel from '../models/userModel'

const createUser = (user) => userModel.create(user)
const getAllUsers = (filter = {}) => userModel.findAll(filter)
export default {
  createUser,
  getAllUsers,
}
