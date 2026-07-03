import { json } from 'express'
import liveRoomsService from '../services/liveRoomsService'
import roomParticipantsService from '../services/roomParticipantsService'

const createLiveRoom = async (req, res) => {
  try {
    const { user } = req
    const { title, scheduledStartAt, scheduledEndAt, participants } = req.body || {}
    const createdBy = user?.flexID?.id
    if (createdBy && title && scheduledStartAt && scheduledEndAt && participants) {
      const data = {
        title,
        scheduledStartAt,
        scheduledEndAt,
        createdBy: createdBy,
        hostId: createdBy,
        status: 'scheduled'
      }
      const room = await liveRoomsService.createLiveRoom(data)
      const roomId = room['_id']
      let queueNo = 1
      const roomParticipants = [{
        roomId,
        userId: createdBy,
        role: 'host',
        status: 'accepted',
        queueNo: queueNo,
        acceptedAt: new Date(),
      }]
      participants.forEach((row) => {
        queueNo += 1
        roomParticipants.push({
          roomId,
          role: 'guest',
          queueNo: queueNo,
          userId: row,
        })
      })
      const createdParticipants = await roomParticipantsService.insertParticipants(roomParticipants)
      return res.status(201).json({
        status: 'OK',
        data: {
          id: roomId,
          createdAt: room['createdAt'],
        },
      })
    } else {
      return res.status(400).json({
        code: 'Bad_Request',
        message: 'Bad Request',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ code: 500, message: 'Internal server error' })
  }
}

const getLiveRoom = async (req, res) => {
  try {
    const { user } = req
    const userId = user?.flexID?.id
    if (userId) {
      const result = await liveRoomsService.getLiveRoomsWithUserId(userId)
      return res.status(200).json(result.map((row) => ({
        'id': row['_id'],
        'title': row['title'],
        'status': row['status'],
        'createdAt': row['createdAt'],
        'scheduledStartAt': row['scheduledStartAt'],
        'scheduledEndAt': row['scheduledEndAt'],
        'participants': row['participants'].map((p) => ({
          'id': p['userId'],
          'role': p['role'],
          'queueNo': p['queueNo'],
        }))
      })))
    } else {
      return res.status(400).json({
        code: 'Bad_Request',
        message: 'Bad Request',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ code: 500, message: 'Internal server error' })
  }
}


const getLiveRoomWithRoomId = async (req, res) => {
  try {
    const { user, params } = req
    const { roomId } = params
    const userId = user?.flexID?.id
    if (userId && roomId) {
      const result = await liveRoomsService.getLiveRoomWithRoomId(roomId)
      if (result?.length > 0) {
        const room = result[0]
        const participants = room.participants;
        const index = participants.findIndex((row) => row.userId == userId)
        if (index !== -1) {
          return res.status(200).json({
            'id': room['_id'],
            'title': room['title'],
            'status': room['status'],
            'scheduledStartAt': room['scheduledStartAt'],
            'scheduledEndAt': room['scheduledEndAt'],
            'actualStartAt': room['actualStartAt'],
            'actualEndAt': room['actualEndAt'],
            'createdBy': room['createdBy'],
            'hostId': room['hostId'],
            'currentGuestId': room['currentGuestId'],
            'createdAt': room['createdAt'],
            'updatedAt': room['updatedAt'],
            'participants': room['participants'].map((p) => ({
              'id': p['userId'],
              'role': p['role'],
              'queueNo': p['queueNo'],
              'status': p['status'],
              'invitedBy': p['invitedBy'],
              'acceptedAt': p['acceptedAt'],
              'joinedAt': p['joinedAt'],
              'leftAt': p['leftAt'],
            })).sort((a, b) => a.queueNo - b.queueNo)
          })
        } else {
          return res.status(401).json({
            code: 'Unauthorized',
            message: 'Unauthorized',
          })
        }
      }
      return res.status(404).json({
        code: 'Not_Found',
        message: 'Not Found',
      })
    } else {
      return res.status(400).json({
        code: 'Bad_Request',
        message: 'Bad Request',
      })
    }
  } catch (err) {
    console.log(err)
    return res.status(500).json({ code: 500, message: 'Internal server error' })
  }
}

export default {
  createLiveRoom,
  getLiveRoom,
  getLiveRoomWithRoomId,
}
