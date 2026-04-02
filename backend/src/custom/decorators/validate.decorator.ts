<<<<<<< HEAD
import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

export const ValidatedBody = createParamDecorator(
  (schema: ObjectSchema, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      throw new BadRequestException(error.details.map(d => d.message).join(', '));
    }
    return value; // this will be injected into the parameter
  }
);

=======
import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

export const ValidatedBody = createParamDecorator(
  (schema: ObjectSchema, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const { error, value } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      throw new BadRequestException(error.details.map(d => d.message).join(', '));
    }
    return value; // this will be injected into the parameter
  }
);

>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
