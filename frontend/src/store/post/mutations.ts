import { MutationTree } from 'vuex';
import { PostStateInterface } from './state';
import { PostModel } from 'src/models/feed/post.model';
import { PaginationData } from 'src/models/common/pagination.model';
import { CommentModel } from 'src/models/feed/comment.model';

const mutation: MutationTree<PostStateInterface> = {
  SET_POSTS(state, posts: PaginationData<PostModel[]>) {
    if (posts.meta.currentPage === 1) state.posts = posts.items;
    else state.posts = [...(state.posts || []), ...posts.items];
    state.postsMeta = posts.meta;
  },
  UPDATE_POST(state, post: PostModel) {
    if (!state.posts) return;
    const index = state.posts.findIndex((p) => p.id === post.id);
    state.posts[index].description = post.description;
    if (state.postDetail?.id === post.id) state.postDetail.description = post.description;
  },
  DELETE_POST(state, id: number) {
    if (!state.posts) return;
    const index = state.posts.findIndex((p) => p.id === id);
    state.posts.splice(index, 1);
  },
  SET_POST_DETAIL(state, post: PostModel) {
    state.postDetail = post;
  },

  TOGGLE_LIKE(state, { id }) {
    const post = state.posts?.find((p) => p.id === id);
    if (post) {
      post.isViewerLiked = !post.isViewerLiked;
      post.isViewerLiked ? post.likesNumber++ : post.likesNumber--;
    }
    if (state.postDetail) {
      state.postDetail.isViewerLiked = !state.postDetail.isViewerLiked;
      state.postDetail.isViewerLiked ? state.postDetail.likesNumber++ : state.postDetail.likesNumber--;
    }
  },
  TOGGLE_FOLLOW(state, authorID) {
    const post = state.posts?.find((p) => p.author.id === authorID);
    if (post) post.author.isViewerFollowed = !post.author.isViewerFollowed;
    if (state.postDetail) state.postDetail.author.isViewerFollowed = !state.postDetail.author.isViewerFollowed;
  },

  CREATE_COMMENT(state, comment: CommentModel) {
    if (!state.posts) return;
    const post = state.posts.find((p) => p.id === comment.postID);
    if (post) {
      post.comments?.unshift(comment);
      post.commentsNumber++;
    }
    if (state.postDetail) {
      state.postDetail.comments?.unshift(comment);
      state.postDetail.commentsNumber++;
    }
  },
  UPDATE_COMMENT(state, comment: CommentModel) {
    if (!state.posts) return;
    const post = state.posts.find((p) => p.id === comment.postID);
    if (!post) return;

    const index = post.comments?.findIndex((c) => c.id === comment.id);
    if (index === undefined || index === -1) return;
    post.comments[index] = comment;
    if (state.postDetail && state.postDetail.comments) state.postDetail.comments[index] = comment;
  },
  DELETE_COMMENT(state, { commentID, postID }: { commentID: number; postID: number }) {
    if (!state.posts) return;
    const post = state.posts.find((p) => p.id === postID);
    if (!post) return;

    const index = post.comments.findIndex((c) => c.id === commentID);
    post.comments.splice(index, 1);
    post.commentsNumber--;

    if (state.postDetail && state.postDetail.comments) {
      state.postDetail.comments.splice(index, 1);
      state.postDetail.commentsNumber--;
    }
  },
  TOGGLE_COMMENT_LIKE(state, { commentID, postID }: { commentID: number; postID: number }) {
    const post = state.posts?.find((p) => p.id === postID);
    if (!post) return;

    const comment = post.comments?.find((c) => c.id === commentID);
    if (comment) comment.isViewerLiked = !comment.isViewerLiked;

    if (state.postDetail && state.postDetail.comments) {
      const comment = state.postDetail.comments?.find((c) => c.id === commentID);
      if (comment) comment.isViewerLiked = !comment.isViewerLiked;
    }
  },
};

export default mutation;
