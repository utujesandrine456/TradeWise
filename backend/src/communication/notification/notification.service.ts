<<<<<<< HEAD
import { Injectable, forwardRef, Inject } from '@nestjs/common';
import { ENFinancialType, ENNotificationFilterType, ENNotificationImpact } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationGateway } from './notification.gateway';

@Injectable()  // for returning messsage - working with schedule
export class NotificationService {
    public constructor(
        private readonly prismaService: PrismaService,
        @Inject(forwardRef(() => NotificationGateway))
        private readonly notificationGateway: NotificationGateway,
=======
import { Injectable } from '@nestjs/common';
import { ENFinancialType, ENNotificationFilterType, ENNotificationImpact } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
    public constructor(
        private readonly prismaService: PrismaService
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
    ) {}

    public async financialRemainder(traderId: string, type: ENFinancialType) {
        // if trader exists
        const traderExists = await this.prismaService.mTrader.findUnique({
            where: { id: traderId }
        });
        if(!traderExists)
            return;

        const title = 'Financial Reminder';
        const message =
            type === ENFinancialType.Credit
                ? 'You have an upcoming payment due. Please ensure you have sufficient balance before the deadline.'
                : 'A debit transaction reminder: please review your recent transactions.';

<<<<<<< HEAD
        const notification = await this.prismaService.mNotification.create({
=======
        const notification = this.prismaService.mNotification.create({
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
            data: {
                traderId, title, message,
                type: 'financial_remainder',
                impact: ENNotificationImpact.High,
                filterType: ENNotificationFilterType.WARNING
            }
        });
<<<<<<< HEAD

        // Send real-time notification via WebSocket
        this.notificationGateway.sendNotificationToTrader(traderId, notification);
    }

    public async lowStockAlert(traderId: string, stockImageId: string) {
        // if trader exists
        const traderExists = await this.prismaService.mTrader.findUnique({
            where: { id: traderId }
        });
        if(!traderExists) return;

        const stockImage = await this.prismaService.mStockImage.findUnique({
            where: { id: stockImageId }
        });
        if(!stockImage) return;

        const title = 'Low Stock Alert';
        const message = `Inventory for "${stockImage.name}" has fallen below the required level. Please review and restock as needed.`;

        const notification = await this.prismaService.mNotification.create({
            data: {
                traderId, title, message,
                type: 'low_stock_alert',
                impact: ENNotificationImpact.High,
                filterType: ENNotificationFilterType.WARNING
            }
        });

        // Send real-time notification via WebSocket
        this.notificationGateway.sendNotificationToTrader(traderId, notification);

        // update the stockimage
        await this.prismaService.mStockImage.update({
            where: { id: stockImageId },
            data: { notified: true }
        });
=======
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
    }
}
