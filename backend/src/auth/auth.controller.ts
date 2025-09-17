import { Body, Controller, Get, Patch, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginTraderDto, RegisterTraderDto, UpdateProfileDto } from './auth.dto';
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
    
    @UseGuards(ProtectedRoutesGuard)
    @Post('logout')
    public logout(@Res({ passthrough: true }) res: Response) {
        res.cookie('accessToken', '', { maxAge: 0 });
        res.clearCookie('accessToken', { path: '/' });

        return { message: 'Logged out successfully' };
    }
    
    @UseGuards(ProtectedRoutesGuard)
    @Get('profile')
    public getProfile(
        @CurrentTrader() currentTrader: TJwtPayload
    ) {
        return this.authService.getProfile(currentTrader.sub);
    }

    @UseGuards(ProtectedRoutesGuard)
    @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
    @Patch('profile')
    public async update(
        @CurrentTrader() currentTrader: TJwtPayload,
        @Body() dto: UpdateProfileDto,
        @UploadedFile() file?: Express.Multer.File,
    ) {
        let profilePicture: string | undefined;
        const trader = await this.authService.getProfile(currentTrader.sub);

        if(file) {
            // destroy old profile picture
            if(trader.profilePicture){
                // eg: https://res.cloudinary.com/dizkxmaoh/image/upload/v1757333897/traders/imphlmkadkkndaptyszm.png => traders/imphlmkadkkndaptyszm
                const publicId = extractPublicId(trader.profilePicture);
                if(publicId) {
                    console.log('Attempting to delete public_id:', publicId);
                    try {
                        const result = await cloudinary.uploader.destroy(publicId, {
                            invalidate: true,
                            resource_type: 'image',
                        });

                        console.log('Destroy result:', result);  // Should log { result: 'ok' } or { result: 'not_found' }
            
                        if (result.result === 'not_found') {
                            console.warn('Image not found in Cloudinary - already deleted?');
                        }
                    } catch (error) {
                        console.error('Error destroying image:', error);
                    }
                } else {
                    console.warn('Invalid URL - could not extract public_id');
                }
            }

            // upload new one
            const result = await new Promise<CloudinaryUploadResult>((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { 
                        folder: 'traders', 
                        resource_type: 'image',
                        transformation: [
                            { width: 300, height: 300, crop: 'fill', gravity: 'face' }, // square crop, focus on face
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

            profilePicture = result.secure_url;
        }

        return this.authService.updateProfile({...dto, profilePicture}, currentTrader.sub);
    }
}
