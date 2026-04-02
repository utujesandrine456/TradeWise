<<<<<<< HEAD
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    public constructor(private schema: ObjectSchema) {}

    public transform(value: any) {
        const { error } = this.schema.validate(value, { abortEarly: false });
        if (error) {
        // Combine all error messages into one string
        const messages = error.details.map((d) => d.message).join(', ');
        throw new BadRequestException(messages);
        }
        return value;
    }

    // Optional: static helper method to create the pipe more cleanly
    public static create(schema: ObjectSchema) {
        return new JoiValidationPipe(schema);
    }
}
=======
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { ObjectSchema } from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
    public constructor(private schema: ObjectSchema) {}

    public transform(value: any) {
        const { error } = this.schema.validate(value, { abortEarly: false });
        if (error) {
        // Combine all error messages into one string
        const messages = error.details.map((d) => d.message).join(', ');
        throw new BadRequestException(messages);
        }
        return value;
    }

    // Optional: static helper method to create the pipe more cleanly
    public static create(schema: ObjectSchema) {
        return new JoiValidationPipe(schema);
    }
}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
