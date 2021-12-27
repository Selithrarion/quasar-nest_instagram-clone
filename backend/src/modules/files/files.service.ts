import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { S3 } from 'aws-sdk';

import { PublicFileEntity, UploadFileOptions } from './entity/public-file.entity';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import * as sharp from 'sharp';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(PublicFileEntity)
    private readonly files: Repository<PublicFileEntity>
  ) {}

  async uploadPublicFile(options: UploadFileOptions): Promise<PublicFileEntity> {
    const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const validImageSize = 1024 * 1024 * options.imageMaxSizeMB;
    const isInvalidType = !validImageTypes.includes(options.file.mimetype);

    if (isInvalidType) throw new HttpException('INVALID_FILE_TYPE', HttpStatus.UNPROCESSABLE_ENTITY);
    if (validImageSize < options.file.size)
      throw new HttpException('INVALID_FILE_SIZE', HttpStatus.UNPROCESSABLE_ENTITY);

    const fileBuffer = await sharp(options.file.buffer).webp({ quality: options.quality }).toBuffer();
    const filename = uuidv4() + extname(options.file.originalname);

    const Bucket = process.env.AWS_PUBLIC_S3_BUCKET_NAME;
    const ACL = 'public-read';

    const s3 = new S3();
    const uploadedFile = await s3
      .upload({
        Bucket,
        ACL,
        Body: fileBuffer,
        Key: filename,
      })
      .promise();

    const newFile = this.files.create({
      key: uploadedFile.Key,
      url: uploadedFile.Location,
    });
    await this.files.save(newFile);

    return newFile;
  }

  async deletePublicFile(id: number): Promise<void> {
    const file = await this.files.findOne(id);
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: process.env.AWS_PUBLIC_S3_BUCKET_NAME,
        Key: file.key,
      })
      .promise();
    await this.files.delete(id);
  }
}
