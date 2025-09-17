import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { JwtModule } from '@nestjs/jwt';
import { ManagementModule } from './management/management.module';
import { GraphQLModule } from '@nestjs/graphql';
import * as path from 'path';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AppResolver } from './app.resolver';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommunicationModule } from './communication/communication.module';

@Module({
    imports: [
        AuthModule,
        PrismaModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            global: true,
            useFactory: (configService: ConfigService) => ({
                secret: configService.jwt_secret().get(),
            }),
        }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
            driver: ApolloDriver,
            autoSchemaFile: path.join(process.cwd(), 'src/graphql/schema.gql'),
        }),
        CommunicationModule,
        ManagementModule,
    ],
    controllers: [AppController],
    providers: [AppResolver, AppService],
})
export class AppModule implements NestModule {
    public configure(consumer: MiddlewareConsumer) {}
}