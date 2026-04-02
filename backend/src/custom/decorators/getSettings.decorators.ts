<<<<<<< HEAD
import { createParamDecorator } from "@nestjs/common";

export const GetSettings = () => createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.settings;
=======
import { createParamDecorator } from "@nestjs/common";

export const GetSettings = () => createParamDecorator((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.settings;
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
})