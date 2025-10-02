import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import * as multer from 'multer';

export const cloudinaryConfig = (configService: ConfigService) => {
  cloudinary.config({
    cloud_name: configService.get('CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get('CLOUDINARY_API_KEY'),
    api_secret: configService.get('CLOUDINARY_API_SECRET'),
  })
}

export { cloudinary }; // 👈 so you can use uploader.destroy()

export const storage = new CloudinaryStorage({
  cloudinary,
  params: () => ({
    folder: 'tradewise',
    allowed_formats: ['png', 'jpg', 'jpeg', 'gif', 'webp'],
    resource_type: 'auto',
    format: 'webp',
    transformation: [{ width: 150, height: 150, crop: 'limit' }],
  }),
});

export const upload = multer({ storage });
