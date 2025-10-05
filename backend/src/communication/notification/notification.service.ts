import { Injectable } from '@nestjs/common';
import { ENFinancialType, ENNotificationFilterType, ENNotificationImpact } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class NotificationService {
    public constructor(
        private readonly prismaService: PrismaService
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

        const notification = this.prismaService.mNotification.create({
            data: {
                traderId, title, message,
                type: 'financial_remainder',
                impact: ENNotificationImpact.High,
                filterType: ENNotificationFilterType.WARNING
            }
        });
    }
}
