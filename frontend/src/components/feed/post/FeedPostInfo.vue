<template>
  <div class="feed-post-info" :class="{ 'feed-post-info--scroll': commentsScroll }">
    <div class="feed-post-info__header">
      <BaseButton
        class="text-subtitle2 text-weight-bold w-fit-content"
        style="margin-left: -4px"
        dense
        flat
        @click="dialog.open('postLikes')"
      >
        {{ post.likesUserIDs.length }} likes
      </BaseButton>
      <div v-if="commentsScroll" class="text-caption text-blue-grey-4">
        {{ formatDate(post.createdAt, DateTypes.DIFF) }}
      </div>
    </div>

    <div :class="{ 'comments-scroll q-ml-md q-mr-sm q-mb-md': commentsScroll }">
      <div class="feed-post-info__description">
        <b>{{ post.author.username }}</b>
        {{ formattedDescription }}
        <BaseButton
          v-if="clampDescriptionLocal && post.description?.length >= 101"
          label="Show more"
          plain-style
          @click="clampDescriptionLocal = false"
        />
      </div>

      <template v-if="post.comments.length">
        <BaseButton
          v-if="!hideViewAllComments && post.comments.length !== post.commentIDs.length"
          class="text-subtitle2 text-blue-grey-4 w-fit-content"
          style="margin-left: -4px"
          dense
          flat
          @click="$emit('open-post')"
        >
          View all comments ({{ post.commentIDs.length }})
        </BaseButton>

        <div class="column gap-1">
          <FeedPostComment
            v-for="comment in post.comments"
            :key="comment"
            :comment="comment"
            :minimized="minimizedComments"
            @reply="$emit('reply', comment)"
          />
        </div>
      </template>
    </div>

    <div v-if="!commentsScroll" class="text-caption text-blue-grey-4">
      {{ formatDate(post.createdAt, DateTypes.DIFF) }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import useDialog from 'src/composables/common/useDialog';
import { useFormat, DateTypes } from 'src/composables/format/useFormat';

import FeedPostComment from 'components/feed/post/FeedPostComment.vue';

import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'FeedPostInfo',

  components: {
    FeedPostComment,
  },

  props: {
    post: {
      type: Object as PropType<PostModel>,
      required: true,
    },

    hideViewAllComments: Boolean,
    commentsScroll: Boolean,
    clampDescription: Boolean,
    minimizedComments: Boolean,
  },

  emits: ['open-post', 'reply'],

  setup(props) {
    const dialog = useDialog();
    const { formatDate } = useFormat();

    const clampDescriptionLocal = ref(props.clampDescription);
    const formattedDescription = computed(() => {
      if (!clampDescriptionLocal.value) return props.post.description;

      if (!props.post.description || props.post.description.length <= 100) return props.post.description;
      return props.post.description.slice(0, 100) + ' ...';
    });

    return {
      dialog,
      formatDate,
      DateTypes,

      clampDescriptionLocal,
      formattedDescription,
    };
  },
});
</script>

<style lang="scss" scoped>
.feed-post-info {
  position: relative;
  display: flex;
  flex-flow: column;
  &:not(.feed-post-info--scroll) {
    padding: 0 8px 16px 16px;
  }

  &--scroll {
    flex-grow: 1;
    overflow: hidden;

    .feed-post-info__header {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 0 8px 8px 16px;
      border-bottom: 1px solid $blue-grey-3;
    }
    .feed-post-info__description {
      padding: 12px 0;
    }
  }

  .comments-scroll {
    position: absolute;
    top: 40px;
    bottom: 0;
    left: 0;
    flex-grow: 1;

    height: calc(100% - 32px);
    width: calc(100% - 32px);
    overflow-y: scroll;
  }
}
</style>
