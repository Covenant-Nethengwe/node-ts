import { NextFunction, Request, Response } from "express";
import { validatePassword } from "../services/user.service";
import { createSession, findSessions, updateSession } from "../services/session.service";
import config from 'config';
import { signJwt } from "../utils/jwt.utils";
import { CreateSessionInput } from "../schema/session.schema";
import httpStatusCode from 'http-status-codes';

export async function createUserSessionHandler(
  req: Request<{}, {}, CreateSessionInput['body']>, 
  res: Response, 
  next: NextFunction) {
  const user = await validatePassword(req.body)
  
  if (!user) return res.status(401).send('Invalid email or password');

  const session: any = await createSession(user._id, req.get('user-agent') || '');
  const accessTokenTtl = config.get<number>('token.ttl.accessTokenTtl');
  const refreshTokenTtl= config.get<number>('token.ttl.refreshTokenTtl');

  const accessToken = signJwt(
    { ...user, session: session._id },
    'accessTokenPrivateKey',
    { expiresIn: `${accessTokenTtl}m` }
  );

  const refreshToken = signJwt(
    { ...user, session: session._id },
    'accessTokenPrivateKey',
    { expiresIn: `${refreshTokenTtl}m` }
  );

  res.status(httpStatusCode.CREATED).send({ accessToken, refreshToken});
  next();
}

export async function getUserSessionHandler(req: Request, res: Response) {
  const userId = res.locals.user._id;

  const sessions = await findSessions({
    user: userId,
    valid: true
  });

  return res.send(sessions);
}

export async function deleteSessionHandler (req: Request, res: Response) {
  const sessionId = res.locals.user.session;
  
  await updateSession({ _id: sessionId }, { valid: false })

  return res.send({
    accessToken: null,
    refreshToken: null
  });
}