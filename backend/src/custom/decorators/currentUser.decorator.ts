import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from 'express';

export const CurrentUser = createParamDecorator(
    (_: unknown, ctx: ExecutionContext) => {
        let request: Request;

        const gqlCtx = GqlExecutionContext.create(ctx);
        if (gqlCtx) {
            request = gqlCtx.getContext().req;
        } else {
            request = ctx.switchToHttp().getRequest();
        }

        return request.user;
    },
);
