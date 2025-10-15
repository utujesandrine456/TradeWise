import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';



@Injectable()
export class UnProtectedRouteGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    let req: any;

    if (context.getType<'graphql'>() === 'graphql') {
      const gqlCtx = GqlExecutionContext.create(context);
      req = gqlCtx.getContext().req;
    } else {
      req = context.switchToHttp().getRequest();
    }

    const token = req.cookies?.accessToken;

    if (token) {
      try {
        const payload = await this.jwtService.verifyAsync(token);
        if (payload) throw new UnauthorizedException('User is already logged in');
      } catch {
      
        return true;
      }
    }

    return true; 
  }
}
