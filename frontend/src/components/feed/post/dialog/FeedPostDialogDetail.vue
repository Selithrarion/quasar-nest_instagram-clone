<template>
  <BaseDialog :model-value="modelValue" x-large @close="$emit('close')">
    <template #content>
      <div class="row no-wrap">
        <FeedPostImage
          class="w-half"
          style="max-height: calc(100vh - 48px); max-width: calc(100vh - 48px)"
          :post-id="formattedPost.id"
          :src="formattedPost.fileURL"
          :is-viewer-liked="formattedPost.isViewerLiked"
        />

        <div class="column flex-grow-1">
          <div class="flex-center-between q-py-md q-px-sm">
            <CommonUser
              class="full-width q-px-xs"
              size="32px"
              :tooltip="isProfileMode ? null : `Open author's profile`"
              :user="formattedPost.author"
              :clickable="!isProfileMode"
              hide-name
              @click="openAuthorProfile"
            />
            <FeedPostMoreButton
              :post-id="formattedPost.id"
              :author-id="formattedPost.author.id"
              @edit="dialog.open('editPost')"
              @delete="dialog.open('deletePost')"
              @share="dialog.open('share')"
              @report="dialog.open('report')"
            />
          </div>

          <FeedPostInfo
            :post="formattedPost"
            :comments-loading="loading.custom.comments"
            hide-view-all-comments
            use-scroll
            @open-post="focusCommentInput"
            @open-likes="dialog.open('postLikes')"
            @reply="replyComment"
            @toggle-comment-like="toggleCommentLike"
          />

          <FeedPostActions
            class="post-actions"
            :post-id="formattedPost.id"
            :is-viewer-liked="formattedPost.isViewerLiked"
            :is-viewer-saved="formattedPost.isViewerSaved"
            @open-post="focusCommentInput"
          />

          <FeedPostCommentInput
            ref="commentInput"
            :post-id="formattedPost.id"
            :reply-comment="currentReplyComment"
            @remove-reply="currentReplyComment = null"
          />
        </div>
      </div>
    </template>
  </BaseDialog>

  <BaseDialog
    type="delete"
    title="Delete post"
    :model-value="dialog.openedName.value === 'deletePost'"
    :confirm-loading="dialog.loading.value"
    @close="dialog.close"
    @confirm="deletePost(formattedPost.id)"
  >
    Are you sure you want to delete this post?
  </BaseDialog>
  <FeedPostDialogEdit
    :model-value="dialog.openedName.value === 'editPost'"
    :post="formattedPost"
    @edit="$emit('edit', $event)"
    @close="dialog.close"
  />

  <FeedPostDialogLikes
    :model-value="dialog.openedName.value === 'postLikes'"
    :post="formattedPost"
    @close="dialog.close"
  />

  <FeedPostDialogShare :model-value="dialog.openedName.value === 'share'" :post="formattedPost" @close="dialog.close" />
  <FeedPostDialogShareToUser
    :model-value="dialog.openedName.value === 'shareToUser'"
    :post-id="formattedPost?.id"
    @close="dialog.close"
  />

  <FeedPostDialogReport
    :model-value="dialog.openedName.value === 'report'"
    :post="formattedPost"
    @close="dialog.close"
  />
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import useDialog from 'src/composables/common/useDialog';
import useLoading from 'src/composables/common/useLoading';

import CommonUser from 'components/common/CommonUser.vue';
import FeedPostImage from 'components/feed/post/parts/FeedPostImage.vue';
import FeedPostActions from 'components/feed/post/parts/FeedPostActions.vue';
import FeedPostInfo from 'components/feed/post/parts/FeedPostInfo.vue';
import FeedPostCommentInput from 'components/feed/post/comment/FeedPostCommentInput.vue';
import FeedPostMoreButton from 'components/feed/post/parts/FeedPostMoreButton.vue';
import FeedPostDialogLikes from 'components/feed/post/dialog/FeedPostDialogLikes.vue';
import FeedPostDialogEdit from 'components/feed/post/dialog/FeedPostDialogEdit.vue';
import FeedPostDialogShare from 'components/feed/post/dialog/FeedPostDialogShare.vue';
import FeedPostDialogShareToUser from 'components/feed/post/dialog/FeedPostDialogShareToUser.vue';
import FeedPostDialogReport from 'components/feed/post/dialog/FeedPostDialogReport.vue';

import { PostModel } from 'src/models/feed/post.model';
import { CommentModel } from 'src/models/feed/comment.model';

import postRepository from 'src/repositories/postRepository';

export default defineComponent({
  name: 'FeedPostDialogDetail',

  components: {
    CommonUser,
    FeedPostImage,
    FeedPostActions,
    FeedPostInfo,
    FeedPostCommentInput,
    FeedPostMoreButton,
    FeedPostDialogLikes,
    FeedPostDialogEdit,
    FeedPostDialogShare,
    FeedPostDialogShareToUser,
    FeedPostDialogReport,
  },

  props: {
    modelValue: Boolean,
    post: {
      type: Object as PropType<PostModel>,
      default: null,
    },
    mode: {
      type: String,
      default: 'feed',
      validator: (v: string): boolean => {
        return ['feed', 'profile'].includes(v);
      },
    },
  },

  emits: ['close', 'edit'],

  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const dialog = useDialog();
    const loading = useLoading({ customNames: ['comments'] });

    // TODO: add cache like
    // postID: [comments]
    watch(
      () => props.modelValue,
      async () => {
        if (!props.modelValue) return;
        loading.start('comments');
        postComments.value = await postRepository.getComments(props.post.id);
        loading.stop('comments');
      }
    );

    const postComments = ref<CommentModel[]>([]);
    const formattedPost = computed<PostModel>(() => {
      return {
        ...props.post,
        comments: postComments.value,
      };
    });

    const commentInput = ref<InstanceType<typeof FeedPostCommentInput>>();
    function focusCommentInput() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      commentInput.value?.focusInput();
    }

    const currentReplyComment = ref<CommentModel | null>(null);
    function replyComment(comment: CommentModel) {
      currentReplyComment.value = comment;
      focusCommentInput();
    }

    async function openAuthorProfile() {
      await router.push(`/profile/${props.post.author.username}`);
    }

    function toggleCommentLike(commentID: number) {
      const comment = postComments.value.find((c) => c.id === commentID);
      if (comment) comment.isViewerLiked = !comment.isViewerLiked;
    }

    const isProfileMode = computed(() => props.mode === 'profile');

    async function deletePost(postID: number) {
      try {
        dialog.startLoading();
        await store.dispatch('post/delete', postID);
        dialog.close();
        emit('close');
      } finally {
        dialog.stopLoading();
      }
    }

    return {
      dialog,
      loading,

      postComments,
      formattedPost,

      commentInput,
      focusCommentInput,

      currentReplyComment,
      replyComment,

      openAuthorProfile,

      toggleCommentLike,

      isProfileMode,

      deletePost,
    };
  },
});
</script>

<style lang="scss" scoped>
.post-actions {
  border-top: 1px solid $blue-grey-3;
}
</style>
