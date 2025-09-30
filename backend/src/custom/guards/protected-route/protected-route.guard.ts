import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class ProtectedRouteGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let user: any;

    // Check if this is a GraphQL request
    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      user = gqlCtx.getContext().req.user;
    } else {
      // REST request
      const request = context.switchToHttp().getRequest();
      user = request.user;
    }

    if (!user) {
      throw new UnauthorizedException('Unauthorized');
    }

    return true;
  }
}
