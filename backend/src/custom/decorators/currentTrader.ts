import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { TJwtPayload } from "src/auth/auth.types";

export const CurrentTrader = createParamDecorator(
    (data: unknown, ctx: ExecutionContext): TJwtPayload | null => {
        const request = ctx.switchToHttp().getRequest();
        return request.user || null;
    }
)