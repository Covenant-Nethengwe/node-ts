import jwt from 'jsonwebtoken';
import config from 'config';

export function signJwt(
  object: Object,
  keyName: 'accessTokenPrivateKey' | 'refreshTokenPrivateKey',
  options?: jwt.SignOptions | undefined
) {

  const signingKey = Buffer.from(
    config.get<string>(`token.${keyName}`)
  );
  
  return jwt.sign(
    object, 
    signingKey, 
    {
      ...(options && options),
      algorithm: 'RS256',
      allowInsecureKeySizes: true
    }
  );
}

export function verifyJwt(
  token: string,
  keyName: 'accessTokenPublicKey' | 'refreshTokenPublicKey'
) {
  const publicKey = Buffer.from(
    config.get<string>(`token.${keyName}`)
  );

  try {
    const decoded = jwt.verify(
      token,
      publicKey,
      {
        algorithms: [ 'RS256' ]
      }
    );
  
    return {
      valid: true,
      expired: false,
      decoded,
    }
  } catch (e: any) {
    console.log(e);
    
    return {
      valid: false,
      expired: e.message === 'jwt expired',
      decode: null,
    }
  }
}