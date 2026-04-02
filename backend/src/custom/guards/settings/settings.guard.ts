<<<<<<< HEAD
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class SettingsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let req: any;

    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      req = gqlCtx.getContext().req;
    } else {
      req = context.switchToHttp().getRequest();
    }

    return !!req.settings; // true if settings exist, false otherwise
  }
}
=======
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';

@Injectable()
export class SettingsGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    let req: any;

    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      req = gqlCtx.getContext().req;
    } else {
      req = context.switchToHttp().getRequest();
    }

    return !!req.settings; // true if settings exist, false otherwise
  }
}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
