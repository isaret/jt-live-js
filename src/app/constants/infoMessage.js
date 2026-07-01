const MONGO_DB = {
  CONNECTING: {
    serviceCode: 'MONGO_DB_CONNECTING',
    message: 'Connecting MongoDB...',
  },
  CONNECTED: {
    serviceCode: 'MONGO_DB_CONNECTED',
    message: 'Mongoose connection has been connected to',
  },
  DISCONNECTED: {
    serviceCode: 'MONGO_DB_DISCONNECTED',
    message: 'Mongoose connection has been disconnected!.',
  },
  RECONNECTED: {
    serviceCode: 'MONGO_DB_RECONNECTED',
    message: 'Mongoose connection has been reconnected to',
  },
}

// eslint-disable-next-line import/prefer-default-export
export { MONGO_DB }
