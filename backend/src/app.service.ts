import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
    public hello(): string {
        return 'Hello World!';
    }
}
