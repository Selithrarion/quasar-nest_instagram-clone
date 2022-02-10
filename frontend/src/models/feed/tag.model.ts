import { BaseModel } from 'src/models/common/base.model';

export interface TagModel extends BaseModel {
  name: string;
  count: number;
}
