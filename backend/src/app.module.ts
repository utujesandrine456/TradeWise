<<<<<<< HEAD
import { MiddlewareConsumer, NestModule, UnauthorizedException, RequestMethod } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ThrottlerModule } from '@nestjs/throttler';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ManagementModule } from './management/management.module';
import { ScheduleModule } from './schedule/schedule.module';
import { CommunicationModule } from './communication/communication.module';
import { AppCacheModule } from './cache/cache.module';
import { QueueModule } from './queue/queue.module';
import { graphqlLoggerPlugin } from './custom/plugins/graphqlLogger.plugin';
import { SettingsMiddleware } from './custom/middlewares/settings/settings.middleware';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { ConfigService } from '@nestjs/config';
import { EmailService } from './communication/email/email.service';
import { IJwtPayload } from './auth/auth.types';
import * as jwt from 'jsonwebtoken';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
            global: true,
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>("jwt_secret"),
                signOptions: { expiresIn: '7d' }
            }),
        }),
        GraphQLModule.forRootAsync<ApolloDriverConfig>({
            driver: ApolloDriver,
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                autoSchemaFile: join(process.cwd(), 'src/graphql/schema.gql'),
                sortSchema: true,
                context: async ({ req, res }) => {
                    const token = req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];
                    let user: IJwtPayload | undefined = undefined;
                    if (token) {
                        try {
                            const secret = configService.get<string>('jwt_secret');
                            if (!secret) {
                                throw new Error('JWT secret is not configured');
                            }
                            const decoded = jwt.verify(token, secret) as any;
                            user = {
                                sub: decoded.sub,
                                lastLoginAt: decoded.lastLoginAt ? new Date(decoded.lastLoginAt) : new Date()
                            } as IJwtPayload;
                        } catch (err) {
                            user = undefined;
                        }
                    }
                    // const business = await prismaService.mTraderSettings.findUnique({ where: { traderId:user?.sub } });
                    // if (!business) throw new UnauthorizedException('Bussiness settings not found');

                    req.user = user;
                    return { req, res, user };
                },
                plugins: [graphqlLoggerPlugin()]
            }),
        }),
        ThrottlerModule.forRoot([{ ttl: 60, limit: 5 }]),
        ScheduleModule,
        AuthModule,
        CommunicationModule,
        PrismaModule,
        ManagementModule,
        AppCacheModule,
        QueueModule,
    ],
    controllers: [AppController],
    providers: [AppService, AppResolver, EmailService],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SettingsMiddleware)
            .forRoutes({ path: '/*path', method: RequestMethod.ALL })
    }
}
=======
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppResolver } from './app.resolver';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from './auth/auth.module';
import { CommunicationModule } from './communication/communication.module';
import { EmailService } from './communication/email/email.service';
import * as path from 'path';
import { PrismaModule } from './prisma/prisma.module';
import { SettingsMiddleware } from './custom/middlewares/settings/settings.middleware';
import { ManagementModule } from './management/management.module';
import { IJwtPayload } from './auth/auth.types';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>("jwt_secret"),
                signOptions: { expiresIn: '7d' }
            }),
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: path.join(process.cwd(), 'src/graphql/schema.gql'),
            sortSchema: true,
            context: ({ req, res }) => {
                const jwtService = new JwtService();
                const configService = new ConfigService();
                const token = req.cookies?.accessToken || req.headers['authorization']?.split(' ')[1];

                let user: IJwtPayload | undefined = undefined;
                if (token) {
                    try {
                        user = jwtService.verify(token, { secret: configService.get('JWT_SECRET') }) as IJwtPayload;
                    } catch (err) {
                        user = undefined;
                    }
                }
                
                req.user = user;
                return { req, res, user }; 
            },
        }),
        ScheduleModule,
        AuthModule,
        CommunicationModule,
        PrismaModule,
        ManagementModule,
    ],
    controllers: [AppController],
    providers: [AppService, AppResolver, EmailService],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {
        consumer
            .apply(SettingsMiddleware)
            .forRoutes('*path')
    }
}
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
