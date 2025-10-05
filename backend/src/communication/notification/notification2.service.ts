import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class Notification2Service {
    public constructor(
        private readonly prismaService: PrismaService,
    ) {}
}
