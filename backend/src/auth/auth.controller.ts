import { Body, Controller, Get, InternalServerErrorException, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { LoginTraderDto, RegisterTraderDto, UpdateProfileDto, OnboardingDto } from './auth.dto';
import { Request, Response } from 'express';
import { UnProtectedRoutesGuard } from 'src/custom/guards/un-protected-routes/un-protected-routes.guard';
import { ProtectedRoutesGuard } from 'src/custom/guards/protected-routes/protected-routes.guard';
import { CurrentTrader } from 'src/custom/decorators/currentTrader';
import { TJwtPayload } from './auth.types';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import cloudinary from 'src/custom/utils/cloudinary.config';
import { CloudinaryUploadResult } from 'src/custom/types/cloudinary';
import { ConfigService } from 'src/config/config.service';
import { extractPublicId } from 'src/custom/utils/publicId.cloudinary';

@Controller('auth')
export class AuthController {
    public constructor(
        private readonly authService: AuthService,
        private readonly configService: ConfigService,
    ) {}

    @UseGuards(UnProtectedRoutesGuard)
    @Post('register')
    public async register(
        @Body() dto: RegisterTraderDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { token, newTrader: trader } = await this.authService.registerTrader(dto);
        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: this.configService.nodeEnv().get() === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000,  //7d
        });
        
        return trader
    }
    
    @Post('login')
    public async login(
        @Body() dto: LoginTraderDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const { token, loginTrader: trader } =  await this.authService.login(dto, res);

        res.cookie('accessToken', token, {
            httpOnly: true,
            secure: this.configService.nodeEnv().get() === 'production',
            maxAge: 7 * 24 * 60 * 60 * 1000, //7d
        });

        return trader
    }
    
    @Post('logout')
    public async logout(
        @Res({ passthrough: true }) res: Response,
        @CurrentTrader() trader: TJwtPayload,
    ) {
        res.cookie('accessToken', '', {
            httpOnly: true,
            secure: this.configService.nodeEnv().get() === 'production',
            maxAge: 0,
        });
        res.clearCookie('accessToken'); // extra protection
        return { message: 'Logged out successfully' };
    }

    @UseGuards(ProtectedRoutesGuard)
    @UseInterceptors(FileInterceptor('logo', {
        storage: memoryStorage(),
        fileFilter: (req, file, cb) => {
            if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
        limits: {
            fileSize: 5 * 1024 * 1024, //5mb
        }
    }))
    @Post('on-boarding')
    public async onBoarding(
        @Body() dto: OnboardingDto,
        @CurrentTrader() trader: TJwtPayload,
        @UploadedFile() file: Express.Multer.File,
    ) {
        let logo: string | undefined;
        if(file) {
            const traderSettings = await this.authService.getTraderSettings(trader.sub);
            if(traderSettings?.logo){
                const publicId = extractPublicId(traderSettings.logo);
                if(publicId)
                    await cloudinary.uploader.destroy(publicId);
            }
            try {
                const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        {
                            folder: 'logos-tradewise',
                            resource_type: 'image',
                            format: 'webp',
                            quality: 'auto',
                            transformation: [
                                { width: 150, height: 150, crop: 'fill', gravity: 'face' }, // square crop, focus on face
                                { quality: 'auto' },                                        // auto compress
                                { fetch_format: 'auto' }                                    // serve webp/avif if supported
                            ]
                        },
                        (error, uploadResult) => {
                            if(error) reject(error);
                            if (!uploadResult) return reject(new Error('Cloudinary upload returned undefined'));
                            else resolve(uploadResult as CloudinaryUploadResult);
                        }
                    );
                    stream.end(file.buffer);
                });

                logo = result.secure_url;
            } catch (error) {
                throw new InternalServerErrorException('Failed to upload logo', error.message);
            }
        }

        return this.authService.onboarding({ ...dto, logo }, trader.sub);
    }
}
