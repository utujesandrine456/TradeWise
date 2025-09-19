import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";

@Injectable()
export class EmailValidationPipe implements PipeTransform {
    public transform(value: string) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value || !emailRegex.test(value)) {
            throw new BadRequestException('Invalid or empty email format');
        }

        return value;
    }
}