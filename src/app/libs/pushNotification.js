import axios from 'axios'

const ONESIGNAL_API_URL = 'https://api.onesignal.com/notifications?c=push'

export const sendPushNotification = async (userIds, message, data) => {
  try {
    const ONESIGNAL_APP_ID = process.env.ONESIGNAL_APP_ID
    const ONESIGNAL_REST_API_KEY = process.env.ONESIGNAL_REST_API_KEY

    const payload = {
      app_id: ONESIGNAL_APP_ID,
      'include_aliases': {
        'external_id': userIds
      },
      'target_channel': 'push',
      'contents': {
        'en': message,
      },
      'custom_data': data,
    }
    const response = await axios.post(ONESIGNAL_API_URL, payload, {
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Authorization': `Key ${ONESIGNAL_REST_API_KEY}`,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error sending OneSignal push notification:', error.response?.data || error.message)
    throw error
  }
}

export default { sendPushNotification }
