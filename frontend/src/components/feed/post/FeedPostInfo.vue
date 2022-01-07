<template>
  <div class="column gap-2 q-pl-md q-pr-sm q-pb-md">
    <BaseButton
      class="text-subtitle2 text-weight-bold w-fit-content"
      style="margin-left: -4px"
      dense
      flat
      @click="dialog.open('postLikes')"
    >
      {{ likes }} likes
    </BaseButton>

    <div>
      <b>{{ authorName }}</b>
      {{ description }}
    </div>

    <template v-if="comments.length">
      <div class="column gap-1">
        <FeedPostComment v-for="comment in comments" :key="comment" :comment="comment" minimized />
      </div>
      <BaseButton
        class="text-subtitle2 text-blue-grey-4 w-fit-content"
        style="margin-left: -4px"
        dense
        flat
        @click="$emit('open-post')"
      >
        View all comments ({{ comments.length }})
      </BaseButton>
    </template>

    <div class="text-caption text-blue-grey-4">{{ formatDate(createdAt, DateTypes.DIFF) }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import useDialog from 'src/composables/common/useDialog';
import { useFormat, DateTypes } from 'src/composables/format/useFormat';

import FeedPostComment from 'components/feed/post/FeedPostComment.vue';

import { CommentModel } from 'src/models/post/comment.model';

export default defineComponent({
  name: 'FeedPostInfo',

  components: {
    FeedPostComment,
  },

  props: {
    authorName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    likes: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    comments: {
      type: Array as PropType<CommentModel[]>,
      required: true,
    },
  },

  emits: ['open-post'],

  setup() {
    const dialog = useDialog();
    const { formatDate } = useFormat();

    function toggleLike() {
      //
    }

    return {
      dialog,
      formatDate,
      DateTypes,

      toggleLike,
    };
  },
});
</script>

<style scoped></style>
