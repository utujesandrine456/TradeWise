import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

// for testing
@Controller('app')
export class AppController {

    public constructor(private readonly appService: AppService) {}

    @Get()
    public getHello(): string {
        return this.appService.hello();
    }
}
