import { WebSocketGateway } from '@nestjs/websockets';
import { NotificationsService } from './notifications.service';

@WebSocketGateway()
export class NotificationsGateway {
  public constructor(private readonly notificationsService: NotificationsService) {}
}
