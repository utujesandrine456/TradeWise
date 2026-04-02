import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ProtectedRouteGuard } from 'src/custom/guards/protected-route/protected-route.guard';
import { Notification2Service } from './notification2.service';
import { CurrentUser } from 'src/custom/decorators/currentUser.decorator';
import { IJwtPayload } from 'src/auth/auth.types';
import { ENNotificationFilterType } from 'generated/prisma';
import { ENNotificationTimeFilters } from './notification.types';
import { MGqlNotification } from 'src/graphql/circular-dependency';

@UseGuards(ProtectedRouteGuard)
@Resolver(() => MGqlNotification)
export class NotificationResolver {
    constructor(private readonly notification2Service: Notification2Service) {}

    @Query(() => [MGqlNotification])
    async getNotifications(
        @CurrentUser() user: IJwtPayload,
        @Args('timeFilters', { type: () => ENNotificationTimeFilters, nullable: true }) timeFilters?: ENNotificationTimeFilters,
        @Args('filters', { type: () => ENNotificationFilterType, nullable: true }) filters?: ENNotificationFilterType,
    ) {
        return this.notification2Service.getAll(user.sub, filters, timeFilters);
    }

    @Query(() => MGqlNotification)
    public async getANotification(
        @CurrentUser() user: IJwtPayload,
        @Args('id', { type: () => String }) not_id: string,  // used id for simplicity
    ) {
        return this.notification2Service.getA(user.sub, not_id);
    }

    @Mutation(() => MGqlNotification)
    public async markAsRead(
        @CurrentUser() user: IJwtPayload,
        @Args('id', { type: () => String }) not_id: string,
    ) {
        return await this.notification2Service.markAsRead(user.sub, not_id)
    }

    @Mutation(() => Boolean)
    public async markAllAsRead(
        @CurrentUser() user: IJwtPayload,
    ) {
        await this.notification2Service.markAllAsRead(user.sub);
        return true;
    }

    @Mutation(() => Boolean)
    public async deleteReadNotifications(
        @CurrentUser() user: IJwtPayload,
    ) {
        await this.notification2Service.deleteReadNotifications(user.sub);
        return true;
    }

    @Mutation(() => Boolean)
    public async deleteNotification(
        @CurrentUser() user: IJwtPayload,
        @Args('id', { type: () => String }) not_id: string,
    ) {
        await this.notification2Service.deleteNotification(user.sub, not_id);
        return true;
    }
    
}
