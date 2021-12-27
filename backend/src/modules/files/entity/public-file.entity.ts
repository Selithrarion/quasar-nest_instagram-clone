import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/types/base.entity';

export interface UploadFileOptions {
  file: Express.Multer.File;
  quality: number;
  imageMaxSizeMB: number;
  type: 'image' | 'video';
}

@Entity()
export class PublicFileEntity extends BaseEntity {
  @Column()
  url: string;

  @Column()
  key: string;
}
