<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';
import { EmailController } from './email.controller';

@Module({
    imports: [
        ConfigModule
    ],
    providers: [EmailService],
    exports: [EmailService],
    controllers: [EmailController]
})
export class EmailModule {}
=======
import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class EmailModule {}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
