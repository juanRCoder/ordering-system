import { BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

export const FileUploadInterceptor = (fieldName: string) =>
  FileInterceptor(fieldName, {
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    fileFilter: (req, file, callback) => {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.mimetype)) {
        return callback(new BadRequestException('Invalid file type'), false);
      }
      callback(null, true);
    },
  });
