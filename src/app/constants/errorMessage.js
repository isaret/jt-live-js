const MONGO_DB = {
  CONNECTING_FAILED: {
    serviceCode: 'MONGO_DB_CONNECT_FAILED',
    message: 'Can\'t connect to mongo',
  },
  CONNECTION_ERROR: {
    serviceCode: 'MONGO_DB_CONNECTION_ERROR',
    message: 'Mongo connection error',
  },
}

const SERVER = {
  STARTING_FAIED: {
    serviceCode: 'SERVER_START_FAILED',
    message: 'Can\'t start server',
  },
}

export { MONGO_DB, SERVER }
