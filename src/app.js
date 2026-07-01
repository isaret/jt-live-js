import express from 'express'
import routes from './app/routes'
import { URL_PREFIX } from './config'

const app = express();

app.use(express.json());
app.use(`${URL_PREFIX}`, routes)

export default app;
