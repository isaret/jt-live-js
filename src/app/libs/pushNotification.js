import axios from 'axios'

const ONESIGNAL_API_URL = 'https://onesignal.com/api/v1/notifications'

export const sendPushNotification = async (userIds, message, data) => {
  try {
    const ONESIGNAL_APP_ID = '4a16678d-12f5-4bfb-ad24-d51b44d69b4f'
    const ONESIGNAL_REST_API_KEY = 'os_v2_app_jilgpdis6vf7xlje2unujvu3j7rljv7y7eguqqu4tyrbnka6slzdeqlw7znps4cl2tnw6hrbdqee32qjbb6cja5zuzzh2o2emkzbnsq'

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
        Authorization: `Key ${ONESIGNAL_REST_API_KEY}`,
      },
    })

    return response.data
  } catch (error) {
    console.error('Error sending OneSignal push notification:', error.response?.data || error.message)
    throw error
  }
}

export default { sendPushNotification }
