<<<<<<< HEAD
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ENNotificationFilterType } from 'generated/prisma';
import { ENNotificationTimeFilters } from './notification.types';
import { PrismaClientKnownRequestError } from 'generated/prisma/runtime/library';

@Injectable()
export class Notification2Service {
    constructor(private readonly prismaService: PrismaService) {}

    public async getAll(
        traderId: string,
        filters?: ENNotificationFilterType,
        timeFilters?: ENNotificationTimeFilters
    ) {
        const now = new Date();
        let timeCondition: Record<string, any> = {};

        if (timeFilters) {
            switch (timeFilters) {
                case ENNotificationTimeFilters.Read:
                    timeCondition = { read: true };
                    break;
                case ENNotificationTimeFilters.Unread:
                    timeCondition = { read: false };
                    break;
                case ENNotificationTimeFilters.Recent:
                    timeCondition = {
                        createdAt: {
                            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // last 7 days
                        },
                    };
                    break;
                case ENNotificationTimeFilters.Old:
                    timeCondition = {
                        createdAt: {
                            lt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),  // last 7 days
                        },
                    };
                    break;
            }
        }

        return this.prismaService.mNotification.findMany({
            where: {
                traderId,
                ...(filters ? { filterType: filters } : {}),
                ...timeCondition,
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    public async getA(traderId: string, not_id: string) {
        const notification = await this.prismaService.mNotification.findFirst({
            where: { id: not_id, traderId },
        });

        if (!notification)
            throw new NotFoundException('Notification does not exist or does not belong to you');

        return notification;
    }

    public async markAsRead(traderId: string, not_id: string) {
        try {
            const notification = await this.prismaService.mNotification.findUnique({
                where: { id: not_id, traderId },
            });

            if (!notification)
                throw new NotFoundException('Notification does not exist or does not belong to you');

            const updated = await this.prismaService.mNotification.update({
                where: { id: not_id },
                data: { read: true },
            });

            return updated;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Notification not found');
                }
            }
            throw error;
        }
    }

    public async markAllAsRead(traderId: string){
        try {
            await this.prismaService.mNotification.updateMany({
                where: { traderId, read: false },
                data: { read: true }
            });
        } catch (error) {
            throw new InternalServerErrorException("Internal Server error");
        }
    }

    public async deleteReadNotifications(traderId: string) {
        try {
            const deleted = await this.prismaService.mNotification.deleteMany({
                where: { traderId, read: true }
            });
            return deleted.count;
        } catch (error) {
            throw new InternalServerErrorException("Failed to delete read notifications");
        }
    }

    public async deleteNotification(traderId: string, not_id: string) {
        try {
            const notification = await this.prismaService.mNotification.findUnique({
                where: { id: not_id, traderId },
            });

            if (!notification)
                throw new NotFoundException('Notification does not exist or does not belong to you');

            await this.prismaService.mNotification.delete({
                where: { id: not_id }
            });
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2025') {
                    throw new NotFoundException('Notification not found');
                }
            }
            throw error;
        }
    }
=======
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class Notification2Service {
    public constructor(
        private readonly prismaService: PrismaService,
    ) {}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
}
