export const databaseConfigs = {
  host: 'mongodb://mongo:GNbnWtwhhUYIRbADmHfABpdKLAtUyRtn@mongodb.railway.internal:27017',
  database: 'jt-live',
  tls: false,
  delayReconnectTime: parseInt(process.env.DB_DELAY_RECONNECT_MS, 10) || 5000,
  reconnectLimit: parseInt(process.env.DB_RECONNECT_LIMIT, 10) || 5,
}

export const URL_PREFIX = '/api/v1'