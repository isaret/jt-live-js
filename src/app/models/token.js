import { AccessToken } from 'livekit-server-sdk'
import { liveConfigs } from '../../config'

const create = async ({
  identity,
  roomName,
  participantName,
  additionalGrants,
}) => {
  const at = new AccessToken(liveConfigs.apiKey, liveConfigs.apiSecret, {
    identity,
    name: participantName,
  })

  const grant = {
    roomJoin: true,
    room: roomName,
    ...additionalGrants,
  }

  at.addGrant(grant)

  return at.toJwt()
}

export default {
  create,
}
