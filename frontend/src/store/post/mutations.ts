import { MutationTree } from 'vuex';
import { PostStateInterface } from './state';
import { PostModel } from 'src/models/feed/post.model';
import { PaginationData } from 'src/models/common/pagination.model';
import { CommentModel } from 'src/models/feed/comment.model';

const mutation: MutationTree<PostStateInterface> = {
  SET_POSTS(state, posts: PaginationData<PostModel[]>) {
    state.posts = posts.items;
    state.postsMeta = posts.meta;
  },
  UPDATE_POST(state, post: PostModel) {
    if (!state.posts) return;
    const index = state.posts.findIndex((p) => p.id === post.id);
    state.posts[index] = post;
  },
  DELETE_POST(state, id: number) {
    if (!state.posts) return;
    const index = state.posts.findIndex((p) => p.id === id);
    state.posts.splice(index, 1);
  },
  TOGGLE_LIKE(state, { id, userID }) {
    const post = state.posts?.find((p) => p.id === id);
    if (post) {
      post.isViewerLiked = !post.isViewerLiked;
      post.isViewerLiked ? post.likesUserIDs.push(userID) : post.likesUserIDs.pop();
    }
  },

  CREATE_COMMENT(state, comment: CommentModel) {
    if (!state.posts) return;
    const post = state.posts.find((p) => p.id === comment.postID);
    if (post) post.comments.unshift(comment);
  },
  UPDATE_COMMENT(state, comment: CommentModel) {
    if (!state.posts) return;
    const post = state.posts.find((p) => p.id === comment.postID);
    if (!post) return;

    const index = post.comments.findIndex((c) => c.id === comment.id);
    post.comments[index] = comment;
  },
  DELETE_COMMENT(state, { commentID, postID }: { commentID: number; postID: number }) {
    if (!state.posts) return;
    const post = state.posts.find((p) => p.id === postID);
    if (!post) return;

    const index = post.comments.findIndex((c) => c.id === commentID);
    post.comments.splice(index, 1);
  },
};

export default mutation;
