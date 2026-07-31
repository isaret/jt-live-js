import jwt from 'jsonwebtoken'
import axios from 'axios'

const flexIds = {}

const getUserProfileQuery = `
query getProfile($email: String) {
  getProfile(email: $email) {
    id
  }
}
`

export const getUserId = async (token) => {
  try {
    const decoded = jwt.decode(token)
    const id = decoded?.flexID?.id
    const email = decoded?.flexID?.provider?.email
    if (id && email) {
      let userId = flexIds[id]
      if (userId) {
        return userId
      }
      const response = await axios.post(
        'https://api-work.flex.in.th/v1/graphql',
        {
          query: getUserProfileQuery,
          variables: {
            email,
          }
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'token': token,
          }
        }
      )
      userId = response?.data?.data?.getProfile?.id;
      if (userId) {
        flexIds[id] = userId
        return userId
      }
    }
    return null
  } catch (error) {
    console.error('getUserId:', error.message)
    return null
  }
}

export default { getUserId }   