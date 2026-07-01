import mongoose from 'mongoose'
import logger from '../libs/logger'
import { databaseConfigs } from '../../config'
import { MONGO_DB as MONGO_DB_INFO_MSG } from '../constants/infoMessage'
import { MONGO_DB as MONGO_DB_ERROR_MSG } from '../constants/errorMessage'

let client = null
let reconnectCounter = 0


const addConnectionEventListeners = () => {
  mongoose.connection.on('connecting', () => logger.info(MONGO_DB_INFO_MSG.CONNECTING))
  mongoose.connection.on('connected', () => {
    logger.info({
      ...MONGO_DB_INFO_MSG.CONNECTED,
      message: `${MONGO_DB_INFO_MSG.CONNECTED.message} ${databaseConfigs.host}`,
    })
  })
  mongoose.connection.on('reconnected', () => {
    logger.info({
      ...MONGO_DB_INFO_MSG.RECONNECTED,
      message: `${MONGO_DB_INFO_MSG.RECONNECTED.message} ${databaseConfigs.host}`,
    })
  })
  mongoose.connection.on('disconnected', () => logger.info(MONGO_DB_INFO_MSG.DISCONNECTED))
  mongoose.connection.on('error', (err) => logger.error({
    ...MONGO_DB_ERROR_MSG.CONNECTION_ERROR,
    error: err,
  }))

}

const reconnect = (connect) => {
  if (reconnectCounter < databaseConfigs.reconnectLimit) {
    reconnectCounter += 1
    const shouldReconnectNextRound = reconnectCounter < databaseConfigs.reconnectLimit
    logger.info(`[MONGODB] trying to reconnect..., #${reconnectCounter}`)
    connect(shouldReconnectNextRound)
  }
}

const connect = async (isReconnect) => {
  if (!client) {
    const options = {
      dbName: databaseConfigs.database,
      tls: databaseConfigs.tls,
    }

    try {
      if (!isReconnect) addConnectionEventListeners()
      client = await mongoose.connect(databaseConfigs.host, options)
    } catch (error) {
      console.log(error)
      if (reconnectCounter === 0) {
        reconnect(connect)
        return true
      }
      if (isReconnect) {
        return setTimeout(() => {
          reconnect(connect)
        }, databaseConfigs.delayReconnectTime)
      }
      logger.error({
        ...MONGO_DB_ERROR_MSG.CONNECTING_FAILED,
        message: `${MONGO_DB_ERROR_MSG.CONNECTING_FAILED.message} @${databaseConfigs.host}, error: ${error.message}`,
      })
      throw error
    }
  }

  return client
}

const disconnect = async () => {
  client = null
  await mongoose.disconnect()
  mongoose.connection.removeAllListeners()
  logger.info('[MONGODB] close connection...')
}

export default { connect, disconnect }