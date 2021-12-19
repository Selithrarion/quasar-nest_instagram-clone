import { PostModel } from 'src/models/post/post.model';
import { PaginationMeta } from 'src/models/common/pagination.model';

export interface PostStateInterface {
  posts?: PostModel[] | null;
  postsMeta?: PaginationMeta | null;
}
function state(): PostStateInterface {
  return {
    posts: null,
    postsMeta: null,
  };
}

export default state;
