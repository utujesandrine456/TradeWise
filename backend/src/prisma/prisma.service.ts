import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "../../generated/prisma";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    public async onModuleInit() {
        await this.$connect();
        this.logger.log('Prisma connected to database');
    }

    public async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log('Prisma disconnected from database');
    }
}
