<template>
  <BaseDialog large v-bind="$attrs" @close="close">
    <template #content>
      <div class="row">
        <q-img class="w-half" :src="post.fileURL" />

        <div class="w-half">
          <div class="flex-center-between q-py-md q-px-sm ">
            <CommonUser
              class="full-width q-px-xs"
              size="32px"
              tooltip="Open author profile"
              :avatar="post.author?.avatar?.url"
              :color="post.author.color"
              :username="post.author.username"
              @click="openAuthorProfile"
            />
            <FeedPostMoreButton />
          </div>
          <div class="q-px-md q-pb-md q-pt-sm">
            {{ post.description }}
          </div>
          <FeedPostActions @open-post="focusCommentInput" />
          <FeedPostInfo
            :author-name="post.author.username"
            :description="post.description"
            :likes="post.likesUserIDs.length"
            :comments="post.comments"
            :created-at="post.createdAt"
            @open-post="focusCommentInput"
          />
          <FeedPostCommentInput ref="commentInput" />
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useRouter } from 'vue-router';

import CommonUser from 'components/common/CommonUser.vue';
import FeedPostActions from 'components/feed/post/FeedPostActions.vue';
import FeedPostInfo from 'components/feed/post/FeedPostInfo.vue';
import FeedPostCommentInput from 'components/feed/post/FeedPostCommentInput.vue';
import FeedPostMoreButton from 'components/feed/post/FeedPostMoreButton.vue';

import { PostModel } from 'src/models/post/post.model';

export default defineComponent({
  name: 'FeedPostDetailDialog',

  components: {
    CommonUser,
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

  setup(props) {
    const router = useRouter();

    const commentInput = ref<InstanceType<typeof FeedPostCommentInput>>();
    function focusCommentInput() {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      commentInput.value?.focusInput();
    }

    async function openAuthorProfile() {
      await router.push(`/${props.post.author.username}`);
    }

    return {
      commentInput,
      focusCommentInput,

      openAuthorProfile,
    };
  },
});
</script>
