import { MutationTree } from 'vuex';
import { PostStateInterface } from './state';
import { PostModel } from 'src/models/post/post.model';
import { PaginationData } from 'src/models/common/pagination.model';

const mutation: MutationTree<PostStateInterface> = {
  SET_POSTS(state, posts: PaginationData<PostModel[]>) {
    state.posts = posts.items;
    state.postsMeta = posts.meta;
  },
  UPDATE_POST(state, post: PostModel) {
    if (!state.posts) return;
    const index = state.posts.findIndex((d) => d.id === post.id);
    state.posts[index] = post;
  },
  DELETE_POST(state, id: number) {
    if (!state.posts) return;
    const index = state.posts.findIndex((p) => p.id === id);
    state.posts.splice(index, 1);
  },
  TOGGLE_LIKE(state, { id, userID }) {
    const post = state.posts?.find((p) => p.id === id);
    const currentUserID = state;
    if (post) {
      post.isViewerLiked = !post.isViewerLiked;
      post.isViewerLiked ? post.likesUserIDs.push(userID) : post.likesUserIDs.pop();
    }
  },
};

export default mutation;
