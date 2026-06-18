import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadFile(
    file: Express.Multer.File,
    folder: string,
    public_id?: string
  ): Promise<UploadApiResponse> {
    const buffer = file.buffer;
    return new Promise((res, rej) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: public_id ? public_id : Date.now().toString(),
          resource_type: 'image',
          overwrite: true,
        },
        (error, result) => {
          if (error) {
            return rej(new Error(`Error uploading image: ${error.message}`));
          }
          if (!result) {
            return rej(new Error('No response was received from Cloudinary'));
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
          return rej(new Error(`Error deleting image: ${error.message}`));
        }
        if (!result) {
          return rej(new Error('No response was received from Cloudinary'));
        }
        res();
      });
    });
  }
}
