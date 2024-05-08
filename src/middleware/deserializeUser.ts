import { verify } from 'crypto';
import { NextFunction, Request, Response } from 'express';
import { get } from 'lodash';
import { verifyJwt } from '../utils/jwt.utils';
import { issueRefreshToken } from '../services/session.service';
import { string } from 'zod';

const deserializeUser = async (req: Request, res: Response, next: NextFunction) => {
  const accessToken: string = get(req, 'headers.authorization', '').replace(/^Bearer\s/ || /^bearer\s/, '');
  const refreshToken: any = get(req, 'headers.x-refresh', ''); 

  if (!accessToken || accessToken === '<accessToken will be set when you create a session>') return next();

  const { decoded, expired } = verifyJwt(accessToken, 'accessTokenPublicKey');
  
  if (decoded) {
    res.locals.user = decoded;
    return next();
  }
  
  if(expired && refreshToken) {
    const newAccessToken = await issueRefreshToken({ refreshToken });

    newAccessToken && res.setHeader('x-access-token', newAccessToken);

    const result = verifyJwt(newAccessToken, 'accessTokenPublicKey');

    res.locals.user = result.decoded;
    
    return next();
  }

  return next();
}

export default deserializeUser;