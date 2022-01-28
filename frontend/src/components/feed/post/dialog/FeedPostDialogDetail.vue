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
              tooltip="Open author's profile"
              :user="formattedPost.author"
              hide-name
              @click="openAuthorProfile"
            />
            <FeedPostMoreButton
              :post-id="formattedPost.id"
              :author-id="formattedPost.author.id"
              @share="$emit('share')"
              @edit="$emit('edit')"
              @delete="$emit('edit')"
            />
          </div>

          <FeedPostInfo
            :post="formattedPost"
            :comments-loading="loading.custom.comments"
            hide-view-all-comments
            use-scroll
            @open-post="focusCommentInput"
            @open-likes="$emit('open-likes')"
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
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import useLoading from 'src/composables/common/useLoading';

import CommonUser from 'components/common/CommonUser.vue';
import FeedPostImage from 'components/feed/post/parts/FeedPostImage.vue';
import FeedPostActions from 'components/feed/post/parts/FeedPostActions.vue';
import FeedPostInfo from 'components/feed/post/parts/FeedPostInfo.vue';
import FeedPostCommentInput from 'components/feed/post/comment/FeedPostCommentInput.vue';
import FeedPostMoreButton from 'components/feed/post/parts/FeedPostMoreButton.vue';

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
  },

  props: {
    modelValue: Boolean,
    post: {
      type: Object as PropType<PostModel>,
      default: null,
    },
  },

  emits: ['close', 'open-likes', 'delete', 'edit', 'share'],

  setup(props) {
    const router = useRouter();
    const loading = useLoading({ customNames: ['comments'] });

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

    return {
      loading,

      postComments,
      formattedPost,

      commentInput,
      focusCommentInput,

      currentReplyComment,
      replyComment,

      openAuthorProfile,

      toggleCommentLike,
    };
  },
});
</script>

<style lang="scss" scoped>
.post-actions {
  border-top: 1px solid $blue-grey-3;
}
</style>
