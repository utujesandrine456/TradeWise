import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';
import { IJwtPayload } from 'src/auth/auth.types';

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): IJwtPayload | undefined => {
    if (ctx.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(ctx);
      return gqlCtx.getContext().req.user as IJwtPayload;
    } else {
      const request = ctx.switchToHttp().getRequest<Request>();
      return request.user as IJwtPayload;
    }
  },
);
