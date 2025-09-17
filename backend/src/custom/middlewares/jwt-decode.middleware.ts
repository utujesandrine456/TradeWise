import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { TJwtPayload } from 'src/auth/auth.types';
import { ConfigService } from 'src/config/config.service';

// Extend Express Request type to include `user`
declare global {
  namespace Express {
    interface Request {
      user?: TJwtPayload;
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
        const payload = jwtService.verify(token, { secret: configService.jwt_secret().get() });
        req.user = payload;
    }

    next();
  };
}
