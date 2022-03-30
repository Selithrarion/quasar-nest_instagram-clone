<template>
  <!--  TODO: refactor with FeedPostDetailContent-->
  <q-card v-if="mode === 'page'" class="row no-wrap" bordered>
    <FeedPostImage
      class="w-half"
      :mode="mode === 'page' ? 'page' : 'detail'"
      :class="{ 'flex-grow-1': mode === 'page' }"
      :post-id="post.id"
      :src="post.fileURL"
      :is-viewer-liked="post.isViewerLiked"
    />

    <div class="column flex-grow-1">
      <div class="flex-center-between gap-2 q-py-md q-px-sm">
        <CommonUser
          class="full-width q-px-xs"
          size="32px"
          :tooltip="isProfileMode ? null : `Open author's profile`"
          :user="post.author"
          :clickable="!isProfileMode"
          hide-name
          @click="openAuthorProfile"
        />
        <FeedPostMoreButton
          :post-id="post.id"
          :author-id="post.author.id"
          :is-viewer-followed="post.author.isViewerFollowed"
          @edit="dialog.open('editPost')"
          @delete="dialog.open('deletePost')"
          @share="dialog.open('share')"
          @report="dialog.open('report')"
          @toggle-follow="$emit('toggle-follow')"
        />
      </div>

      <FeedPostInfo
        :post="post"
        :comments="postComments"
        :comments-loading="loading.custom.comments"
        hide-view-all-comments
        use-scroll
        @open-post="focusCommentInput"
        @open-likes="dialog.open('postLikes')"
        @reply="replyComment"
        @toggle-comment-like="toggleCommentLike"
        @toggle-like="toggleLike"
        @update-comment="updateComment"
        @delete-comment="postComments.splice($event, 1)"
      />

      <FeedPostActions
        class="post-actions"
        :post-id="post.id"
        :is-viewer-liked="post.isViewerLiked"
        :is-viewer-saved="post.isViewerSaved"
        @open-post="focusCommentInput"
        @toggle-like="toggleLike"
      />

      <FeedPostCommentInput
        ref="commentInput"
        :post-id="post.id"
        :reply-comment="currentReplyComment"
        @create="postComments.unshift($event)"
        @remove-reply="currentReplyComment = null"
      />
    </div>
  </q-card>
  <BaseDialog v-else :model-value="modelValue" x-large @close="$emit('close')">
    <template #content>
      <div class="row no-wrap">
        <FeedPostImage
          class="w-half"
          :mode="mode === 'page' ? 'page' : 'detail'"
          :post-id="post.id"
          :src="post.fileURL"
          :is-viewer-liked="post.isViewerLiked"
        />

        <div class="column flex-grow-1">
          <div class="flex-center-between gap-2 q-py-md q-px-sm">
            <CommonUser
              class="full-width q-px-xs"
              size="32px"
              :tooltip="isProfileMode ? null : `Open author's profile`"
              :user="post.author"
              :clickable="!isProfileMode"
              hide-name
              @click="openAuthorProfile"
            />
            <FeedPostMoreButton
              :post-id="post.id"
              :author-id="post.author.id"
              :is-viewer-followed="post.author.isViewerFollowed"
              @edit="dialog.open('editPost')"
              @delete="dialog.open('deletePost')"
              @share="dialog.open('share')"
              @report="dialog.open('report')"
              @toggle-follow="$emit('toggle-follow')"
            />
          </div>

          <FeedPostInfo
            :post="post"
            :comments="postComments"
            :comments-loading="loading.custom.comments"
            hide-view-all-comments
            use-scroll
            @open-post="focusCommentInput"
            @open-likes="dialog.open('postLikes')"
            @reply="replyComment"
            @toggle-comment-like="toggleCommentLike"
            @toggle-like="toggleLike"
            @update-comment="updateComment"
            @delete-comment="postComments.splice($event, 1)"
          />

          <FeedPostActions
            class="post-actions"
            :post-id="post.id"
            :is-viewer-liked="post.isViewerLiked"
            :is-viewer-saved="post.isViewerSaved"
            @open-post="focusCommentInput"
            @toggle-like="toggleLike"
          />

          <FeedPostCommentInput
            ref="commentInput"
            :post-id="post.id"
            :reply-comment="currentReplyComment"
            @create="postComments.unshift($event)"
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
    @confirm="deletePost(post.id)"
  >
    Are you sure you want to delete this post?
  </BaseDialog>
  <FeedPostDialogEdit
    :model-value="dialog.openedName.value === 'editPost'"
    :post="post"
    @edit="$emit('edit', $event)"
    @close="dialog.close"
  />

  <FeedPostDialogLikes :model-value="dialog.openedName.value === 'postLikes'" :post="post" @close="dialog.close" />

  <FeedPostDialogShare :model-value="dialog.openedName.value === 'share'" :post="post" @close="dialog.close" />
  <FeedPostDialogShareToUser
    :model-value="dialog.openedName.value === 'shareToUser'"
    :post-id="post?.id"
    @close="dialog.close"
  />

  <FeedPostDialogReport :model-value="dialog.openedName.value === 'report'" :post="post" @close="dialog.close" />
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue';
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

import { CommentModel } from 'src/models/feed/comment.model';

import postRepository from 'src/repositories/postRepository';
import BaseDialog from 'components/base/dialog/BaseDialog.vue';

export default defineComponent({
  name: 'FeedPostDetail',

  components: {
    BaseDialog,
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
    mode: {
      type: String,
      default: 'feed',
      validator: (v: string): boolean => {
        return ['feed', 'profile', 'page'].includes(v);
      },
    },
  },

  emits: ['close', 'edit', 'toggle-follow', 'toggle-like'],

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
        if (!props.modelValue || !post.value) return;
        loading.start('comments');
        postComments.value = await postRepository.getComments(post.value.id);
        loading.stop('comments');
      }
    );

    const post = computed(() => store.state.post.postDetail);
    const postComments = ref<CommentModel[]>([]);

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
      if (!post.value?.author?.username) return;
      await router.push(`/profile/${post.value.author.username}`);
    }

    function updateComment(comment: CommentModel, index: number) {
      postComments.value[index] = comment;
    }
    function toggleLike() {
      emit('toggle-like')
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

      post,
      postComments,

      commentInput,
      focusCommentInput,

      currentReplyComment,
      replyComment,

      openAuthorProfile,

      updateComment,
      toggleLike,
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
