<template>
  <BaseDialog x-large @close="$emit('close')">
    <template #content>
      <div class="row">
        <FeedPostImage class="w-half" :post-id="post.id" :src="post.fileURL" :is-viewer-liked="post.isViewerLiked" />

        <div class="w-half">
          <div class="flex-center-between q-py-md q-px-sm">
            <CommonUser
              class="full-width q-px-xs"
              size="32px"
              tooltip="Open author's profile"
              :user="post.author"
              hide-name
              @click="openAuthorProfile"
            />
            <FeedPostMoreButton :post-id="post.id" @share="$emit('share')" />
          </div>

          <div class="q-px-md q-pb-md q-pt-sm break-word">
            {{ post.description }}
          </div>

          <FeedPostActions
            class="post-actions"
            :post-id="post.id"
            :is-viewer-liked="post.isViewerLiked"
            :is-viewer-saved="post.isViewerSaved"
            @open-post="focusCommentInput"
          />
          <FeedPostInfo
            :post="post"
            hide-description
            hide-view-all-comments
            @open-post="focusCommentInput"
            @reply="replyComment"
          />
          <FeedPostCommentInput
            ref="commentInput"
            :post-id="post.id"
            :reply-comment="currentReplyComment"
            @remove-reply="currentReplyComment = null"
          />
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useRouter } from 'vue-router';

import CommonUser from 'components/common/CommonUser.vue';
import FeedPostImage from 'components/feed/post/FeedPostImage.vue';
import FeedPostActions from 'components/feed/post/FeedPostActions.vue';
import FeedPostInfo from 'components/feed/post/FeedPostInfo.vue';
import FeedPostCommentInput from 'components/feed/post/FeedPostCommentInput.vue';
import FeedPostMoreButton from 'components/feed/post/FeedPostMoreButton.vue';

import { PostModel } from 'src/models/feed/post.model';
import { CommentModel } from 'src/models/feed/comment.model';

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
    post: {
      type: Object as PropType<PostModel>,
      default: null,
    },
  },

  emits: ['close', 'share'],

  setup(props) {
    const router = useRouter();

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
      await router.push(`/${props.post.author.username}`);
    }

    return {
      commentInput,
      focusCommentInput,

      currentReplyComment,
      replyComment,

      openAuthorProfile,
    };
  },
});
</script>

<style lang="scss" scoped>
.post-actions {
  border-top: 1px solid $blue-grey-3;
}
</style>
