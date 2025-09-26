import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { IJwtPayload } from 'src/auth/auth.types';
import { MTraderSettings } from 'generated/prisma';


declare global {
  namespace Express {
    interface Request {
      settings?: MTraderSettings;
    }
  }
}


@Injectable()
export class SettingsMiddleware implements NestMiddleware {
  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async use(req: Request, res: Response, next: NextFunction) {
    if(!req.user?.sub) return next();

    const userSettings = await this.prismaService.mTraderSettings.findUnique({
      where: {
        traderId: req.user!.sub
      }
    });

    if(userSettings) {
      req.settings = userSettings;
    }

    next();
  }
}
