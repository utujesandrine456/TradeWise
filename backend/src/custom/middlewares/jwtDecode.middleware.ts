import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { IJwtPayload } from '../../auth/auth.types';
import { ConfigService } from '@nestjs/config';

// Extend Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: IJwtPayload;
    }
  }
}

// Factory function to create the middleware
export function jwtDecodeMiddleware() {
  const jwtService = new JwtService();
  const configService = new ConfigService();
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1]; // Bearer token

    if (token) {
      try {
        const payload = jwtService.verify(token, { secret: configService.get('JWT_SECRET') });
        req.user = payload;
      } catch (error) {
        req.user = undefined;
      }
    }

    return next();
  };
}