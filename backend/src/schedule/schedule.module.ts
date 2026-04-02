import { Module } from '@nestjs/common';
import { ScheduleModule as NestScheduleModule } from '@nestjs/schedule';
import { ScheduleService } from './schedule.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationModule } from 'src/communication/notification/notification.module';

@Module({
    imports: [ 
        NestScheduleModule.forRoot(),
        PrismaModule,
        NotificationModule
    ],
    providers: [ ScheduleService ],
})
export class ScheduleModule {}
