import mongoose from 'mongoose';
import logger from './logger';
import config  from 'config';

const connect = async () => {
  const dbUri: string = config.get<string>('dbUri');
  
  try {
    await mongoose.connect(dbUri)
    logger.info(`DB connected to: ${dbUri}`);
    
  } catch (error) {
    logger.error(`Could not connect to DB: ${dbUri}`);
    // process.exit(1);
  }
}

export default connect;