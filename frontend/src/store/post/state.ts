import { PostModel } from 'src/models/feed/post.model';
import { PaginationMeta } from 'src/models/common/pagination.model';

export interface PostStateInterface {
  posts?: PostModel[] | null;
  postsMeta?: PaginationMeta | null;

  postDetail?: PostModel | null;
}
function state(): PostStateInterface {
  return {
    posts: null,
    postsMeta: null,

    postDetail: null,
  };
}

export default state;
