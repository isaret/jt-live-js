import { json } from 'express'
import liveRoomsService from '../services/liveRoomsService'
import roomParticipantsService from '../services/roomParticipantsService'

const createLiveRoom = async (req, res) => {
  try {
    const { user } = req
    const { title, scheduledStartAt, scheduledEndAt, participants, description } = req.body || {}
    const createdBy = user?.flexID?.id
    if (createdBy && title && scheduledStartAt && scheduledEndAt && participants) {
      const data = {
        title,
        scheduledStartAt,
        scheduledEndAt,
        createdBy: createdBy,
        hostId: createdBy,
        status: 'scheduled',
        description: description,
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
      await roomParticipantsService.insertParticipants(roomParticipants)
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
        'description': row['description'],
        'status': row['status'],
        'hostId': row['hostId'],
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
            'description': room['description'],
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

const updateLiveRoom = async (req, res) => {
  try {
    const { user, params } = req
    const { roomId } = params
    const { title, scheduledStartAt, scheduledEndAt, participants, description } = req.body || {}
    const userId = user?.flexID?.id

    if (userId && roomId) {
      const data = {}
      if (title) data.title = title
      if (scheduledStartAt) data.scheduledStartAt = scheduledStartAt
      if (scheduledEndAt) data.scheduledEndAt = scheduledEndAt
      if (description !== undefined) data.description = description

      await liveRoomsService.updateLiveRoom(roomId, data)

      if (participants && Array.isArray(participants)) {
        // Fetch current guests
        const currentParticipants = await roomParticipantsService.getAllParticipants({ roomId: roomId, role: 'guest' })
        const currentGuestIds = currentParticipants.map(p => p.userId.toString())

        // Find which to remove
        const toRemove = currentGuestIds.filter(id => !participants.includes(id))
        if (toRemove.length > 0) {
          await roomParticipantsService.deleteParticipants({ roomId: roomId, role: 'guest', userId: { $in: toRemove } })
        }

        // Find which to add
        const toAdd = participants.filter(id => !currentGuestIds.includes(id))
        if (toAdd.length > 0) {
          const allParticipants = await roomParticipantsService.getAllParticipants({ roomId: roomId })
          let maxQueueNo = allParticipants.reduce((max, p) => p.queueNo > max ? p.queueNo : max, 0)

          const newParticipants = toAdd.map(id => {
            maxQueueNo += 1
            return {
              roomId,
              role: 'guest',
              queueNo: maxQueueNo,
              userId: id,
            }
          })
          await roomParticipantsService.insertParticipants(newParticipants)
        }
      }

      return res.status(200).json({
        status: 'OK',
        message: 'Room updated successfully',
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

const deleteLiveRoom = async (req, res) => {
  try {
    const { user, params } = req
    const { roomId } = params
    const userId = user?.flexID?.id

    if (userId && roomId) {
      const result = await liveRoomsService.getLiveRoomWithRoomId(roomId)
      if (result?.length > 0) {
        const room = result[0]
        if (room.hostId == userId || room.createdBy == userId) {
          // Delete room
          await liveRoomsService.deleteLiveRoom(roomId)
          // Delete participants
          await roomParticipantsService.deleteParticipants({ roomId: roomId })

          return res.status(200).json({
            status: 'OK',
            message: 'Room deleted successfully',
          })
        } else {
          return res.status(403).json({
            code: 'Forbidden',
            message: 'Only the host can delete this room',
          })
        }
      }
      return res.status(404).json({
        code: 'Not_Found',
        message: 'Room not found',
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

const setLiveRoomStatus = async (req, res) => {
  try {
    const { user, params } = req
    const { roomId } = params
    const { status } = req.body
    const userId = user?.flexID?.id
    
    const validStatuses = ['draft', 'scheduled', 'preparing', 'live', 'ended', 'cancelled']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        code: 'Bad_Request',
        message: 'Invalid status',
      })
    }
    
    if (userId && roomId) {
      const result = await liveRoomsService.getLiveRoomWithRoomId(roomId)
      if (result?.length > 0) {
        const room = result[0]
        if (room.hostId == userId || room.createdBy == userId) {
          const data = { status }
          
          if (status === 'live' && !room.actualStartAt) {
            data.actualStartAt = new Date()
          } else if ((status === 'ended' || status === 'cancelled') && !room.actualEndAt) {
            data.actualEndAt = new Date()
          }
          
          await liveRoomsService.updateLiveRoom(roomId, data)
          
          return res.status(200).json({
            status: 'OK',
            message: 'Room status updated successfully',
          })
        } else {
          return res.status(403).json({
            code: 'Forbidden',
            message: 'Only the host can update the room status',
          })
        }
      }
      return res.status(404).json({
        code: 'Not_Found',
        message: 'Room not found',
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

const setParticipantStatus = async (req, res) => {
  try {
    const { user, params } = req
    const { roomId, participantUserId } = params
    const { status } = req.body
    const userId = user?.flexID?.id
    
    const validStatuses = ['invited', 'accepted', 'declined', 'waiting', 'live', 'left', 'removed']
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        code: 'Bad_Request',
        message: 'Invalid status',
      })
    }
    
    if (userId && roomId && participantUserId) {
      const result = await liveRoomsService.getLiveRoomWithRoomId(roomId)
      if (result?.length > 0) {
        const room = result[0]
        
        // Check permissions: only host or the participant themselves can update the status
        if (room.hostId == userId || room.createdBy == userId || participantUserId == userId) {
          
          const data = { status }
          
          if (status === 'accepted') {
            data.acceptedAt = new Date()
          } else if (status === 'live') {
            data.joinedAt = new Date()
          } else if (status === 'left' || status === 'removed') {
            data.leftAt = new Date()
          }
          
          await roomParticipantsService.updateParticipants({ roomId, userId: participantUserId }, data)
          
          return res.status(200).json({
            status: 'OK',
            message: 'Participant status updated successfully',
          })
        } else {
          return res.status(403).json({
            code: 'Forbidden',
            message: 'Only the host or the participant can update this status',
          })
        }
      }
      return res.status(404).json({
        code: 'Not_Found',
        message: 'Room not found',
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
  updateLiveRoom,
  deleteLiveRoom,
  setLiveRoomStatus,
  setParticipantStatus,
}
