import { BadRequestException, Injectable } from '@nestjs/common';
import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    public_id?: string
  ): Promise<UploadApiResponse> {
    const buffer = file.buffer;

    const options: UploadApiOptions = public_id
      ? { public_id, resource_type: 'image', overwrite: true }
      : {
          folder,
          public_id: Date.now().toString(),
          resource_type: 'image',
          overwrite: true,
        };

    return new Promise((res, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        options,
        (error, result) => {
          if (error) {
            return rej(
              new BadRequestException({
                code: 'CLOUDINARY_UPLOAD_ERROR',
                message: `Error uploading image: ${error.message}`,
              })
            );
          }
          if (!result) {
            return rej(
              new BadRequestException({
                code: 'CLOUDINARY_UPLOAD_ERROR',
                message: 'No response was received from Cloudinary',
              })
            );
          }
          res(result);
        }
      );
      uploadStream.end(buffer);
    });
  }

  async deleteFile(public_id: string): Promise<void> {
    return new Promise((res, rej) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) {
          return rej(
            new BadRequestException({
              code: 'CLOUDINARY_DELETE_ERROR',
              message: `Error deleting image: ${error.message}`,
            })
          );
        }
        if (!result) {
          return rej(
            new BadRequestException({
              code: 'CLOUDINARY_DELETE_ERROR',
              message: 'No response was received from Cloudinary',
            })
          );
        }
        res();
      });
    });
  }
}
