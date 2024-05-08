import express from 'express';
import config from 'config';
import connect from './src/utils/connect';
import logger from './src/utils/logger';
import routes from './src/routes/routes';
import  deserializeUser from './src/middleware/deserializeUser';

const port = config.get<number>('port');
const app = express()


app.use(express.json());
app.use(deserializeUser);

app.listen(port, async () => {
  logger.info(`Server is running on http://localhost:${port}`);

  await connect();
  routes(app);
})
