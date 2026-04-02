import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class VerifiedGuard implements CanActivate {
  public constructor(
    private readonly prismaService: PrismaService
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: Request;

    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      req = gqlCtx.getContext().req;
    } else {
      req = context.switchToHttp().getRequest();
    }

    const user = req?.user;

    if (!user){
      throw new ForbiddenException('User not authenticated');
    }

    const fullUser = await this.prismaService.mTrader.findUnique({ where: { id: user.sub } });
    if(!fullUser){
      throw new ForbiddenException('User not found');
    }
    if (!fullUser.isVerified){
      throw new ForbiddenException('User email not verified');
    }

    return true;
  }
}
