import { createParamDecorator } from "@nestjs/common";

export const GetSettings = () => createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.settings;
})