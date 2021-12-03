import { MutationTree } from 'vuex';
import { PostStateInterface } from './state';
import { PostModel } from 'src/models/post/post.model';
import { PaginationData } from 'src/models/common/pagination.model';

const mutation: MutationTree<PostStateInterface> = {
  SET_POSTS(state, projects: PaginationData<PostModel[]>) {
    state.posts = projects.items;
    state.postsMeta = projects.meta;
  },
  ADD_POST(state: PostStateInterface, project: PostModel) {
    state.posts?.unshift(project);
  },
  UPDATE_POST(state: PostStateInterface, post: PostModel) {
    if (!state.posts) return;
    const index = state.posts.findIndex((d) => d.id === post.id);
    state.posts[index] = post;
  },
  DELETE_POST(state: PostStateInterface, id: number) {
    if (!state.posts) return;
    const index = state.posts.findIndex((p) => p.id === id);
    state.posts.splice(index, 1);
  },
  TOGGLE_FAVORITE(state: PostStateInterface, id: number) {
    const post = state.posts?.find((p) => p.id === id);
    if (post) post.favorite = !post.favorite;
  },
};

export default mutation;
