// src/common/decorators/file-url.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const UploadedFileUrl = createParamDecorator(
    (_data: unknown, ctx: ExecutionContext): string | null => {
        const request = ctx.switchToHttp().getRequest();
        const file = request.file; 
        return file?.path ?? null; 
    },
);
