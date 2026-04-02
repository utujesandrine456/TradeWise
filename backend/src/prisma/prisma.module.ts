<<<<<<< HEAD
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
export class PrismaModule {}
=======
import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
    providers: [PrismaService],
    exports: [PrismaService]
})
export class PrismaModule {}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
