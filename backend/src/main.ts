import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import chalk from 'chalk';
import { ConfigService } from './config/config.service';
import * as cookieParser from 'cookie-parser';
import { JwtService } from '@nestjs/jwt';
import { jwtDecodeMiddleware } from './custom/middlewares/jwt-decode.middleware';
import { loggerMiddleware } from './custom/middlewares/logger/logger.middleware';

const configService = new ConfigService();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.useGlobalPipes(new ValidationPipe({ 
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: false,
    }));
    app.use(cookieParser());
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: 'http://localhost:5173', // frontend URL
        credentials: true,
    });

    // middlewares: 
    app.use(jwtDecodeMiddleware());
    app.use(loggerMiddleware());
    
    const port = configService.port().get();
    const nodeEnv = configService.nodeEnv().get();
    const envColor = nodeEnv === 'production' ? chalk.red.underline(nodeEnv) : chalk.blue.underline(nodeEnv)

    await app.listen(port);


    const logger = new Logger('Bootstrap');
    logger.log(`Rest-API server running on http://localhost:${port}/api in ${envColor}`);
    logger.log(`Graphql server running on http://localhost:${port}/graphql in ${envColor}`);
}

bootstrap();
