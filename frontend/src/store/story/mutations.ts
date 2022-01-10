import { MutationTree } from 'vuex';
import { StoryStateInterface } from './state';
import { PaginationData } from 'src/models/common/pagination.model';
import { StoryModel } from 'src/models/feed/story.model';

const mutation: MutationTree<StoryStateInterface> = {
  SET_STORIES(state, stories: PaginationData<StoryModel[]>) {
    state.stories = stories.items;
    state.storiesMeta = stories.meta;
  },
  UPDATE_STORY(state, post: StoryModel) {
    if (!state.stories) return;
    const index = state.stories.findIndex((d) => d.id === post.id);
    state.stories[index] = post;
  },
  DELETE_STORY(state, id: number) {
    if (!state.stories) return;
    const index = state.stories.findIndex((p) => p.id === id);
    state.stories.splice(index, 1);
  },
};

export default mutation;
