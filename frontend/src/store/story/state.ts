import { StoryModel } from 'src/models/feed/story.model';
import { PaginationMeta } from 'src/models/common/pagination.model';

export interface StoryStateInterface {
  stories?: StoryModel[] | null;
  storiesMeta?: PaginationMeta | null;
}
function state(): StoryStateInterface {
  return {
    stories: null,
    storiesMeta: null,
  };
}

export default state;
