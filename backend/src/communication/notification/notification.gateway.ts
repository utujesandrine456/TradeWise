import {
    WebSocketGateway,
    WebSocketServer,
    OnGatewayConnection,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
    cors: {
        origin: [
            'http://localhost:2016',
            'http://localhost:2017',
            'http://localhost:3000',
            'https://tradewise-cyan.vercel.app',
        ],
        credentials: true,
    },
    namespace: '/notifications',
})
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    private readonly logger = new Logger(NotificationGateway.name);
    private userSockets: Map<string, string> = new Map(); // traderId -> socketId

    constructor(private readonly jwtService: JwtService) {}

    async handleConnection(client: Socket) {
        try {
            // Extract token from handshake
            const token = client.handshake.auth.token || client.handshake.headers.authorization?.split(' ')[1];
            
            if (!token) {
                this.logger.warn(`Client ${client.id} connected without token`);
                client.disconnect();
                return;
            }

            // Verify JWT token
            const payload = await this.jwtService.verifyAsync(token);
            const traderId = payload.sub;

            // Store user-socket mapping
            this.userSockets.set(traderId, client.id);
            client.data.traderId = traderId;

            this.logger.log(`Client connected: ${client.id} (Trader: ${traderId})`);
            
            // Join user to their personal room
            client.join(`trader:${traderId}`);
        } catch (error) {
            this.logger.error(`Connection error: ${error.message}`);
            client.disconnect();
        }
    }

    handleDisconnect(client: Socket) {
        const traderId = client.data.traderId;
        if (traderId) {
            this.userSockets.delete(traderId);
            this.logger.log(`Client disconnected: ${client.id} (Trader: ${traderId})`);
        }
    }

    // Send notification to specific trader
    sendNotificationToTrader(traderId: string, notification: any) {
        this.server.to(`trader:${traderId}`).emit('notification', notification);
        this.logger.log(`Notification sent to trader ${traderId}`);
    }

    // Broadcast to all connected clients
    broadcastNotification(notification: any) {
        this.server.emit('notification', notification);
        this.logger.log('Notification broadcasted to all clients');
    }
}
