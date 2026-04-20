import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VerifiedGuard implements CanActivate {
  public constructor(
    private readonly prismaService: PrismaService
  ) { }

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    // verification check is fully disabled to ensure seamless access as requested
    return true;
  }
}
