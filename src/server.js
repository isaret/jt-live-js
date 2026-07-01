import app from './app'
import database from './app/connections/mongodb'

const port = process.env.PORT || 8080;
const prepareComponentsForStart = () => Promise.all([database.connect()])
const cleanupComponentsForShutdown = () => Promise.all([database.disconnect()])

const startServer = async () => {
  try {
    const server = app.listen(port)

    await prepareComponentsForStart()
    console.log(`Server is running at port: ${port}`)
  } catch (error) {
    cleanupComponentsForShutdown()
    console.log(`Error: ${error.message}`)
  }
}

startServer()
