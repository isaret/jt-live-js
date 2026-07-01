import userService from '../services/userService'

const createUser = async (req, res) => {
  const { name, avatar } = req.body || {}

  try {
    if (name?.trim()?.length > 0 && name?.trim()?.length > 0) {
      const newRecord = await userService.createUser({ name, avatar })
      return res.status(201).json({
        status: 'OK',
        data: newRecord,
      })
    } else {
      return res.status(400).json({
        code: 'Bad_Request',
        message: "Bad Request",
      })
    }
  } catch (err) {
    console.log(err)
    if (err.code === 11000) {
      return res.status(409).json({
        code: "DUPLICATE_NAME",
        message: "Name already exists",
        field: Object.keys(err.keyPattern)[0],
        value: err.keyValue
      });
    }

    return res.status(500).json({ code: 500, message: 'Internal server error' })
  }
}


const getUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers()
    return res.status(200).json(users.map((row) => ({
      id: row?._id,
      name: row?.name,
      avatar: row?.avatar,
    })))
  } catch (err) {
    console.log(err)
    return res.status(500).json({ code: 500, message: 'Internal server error' })
  }
}

export default {
  getUsers,
  createUser,
}
