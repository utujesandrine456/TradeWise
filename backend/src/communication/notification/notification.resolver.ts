import { UseGuards } from '@nestjs/common';
import { Resolver } from '@nestjs/graphql';
import { ProtectedRouteGuard } from 'src/custom/guards/protected-route/protected-route.guard';
import { Notification2Service } from './notification2.service';

@UseGuards(ProtectedRouteGuard)
@Resolver()
export class NotificationResolver {
    public constructor(
        private readonly notification2Service: Notification2Service
    ) {}
}
