import { NextFunction, Request, Response } from "express";
import logger from "../utils/logger";
import httpStatusCode from 'http-status-codes';

import { createUser } from "../services/user.service";
import { CreateUserInput } from "../schema/user.schema";

export const createUserHandler = async (
  req: Request<{}, {}, CreateUserInput['body']>,
  res: Response,
  next: NextFunction) => {
    try {      
      const user = await createUser(req.body);
      
      res.status(httpStatusCode.CREATED);
      res.json(user);
      
      return next();
    } catch (e: any) {
      logger.error(e);
      
      res.status(409);
      res.json(e.message);
      
      return next();
    }
}