<template>
  <div class="column gap-2 q-pl-md q-pr-sm q-pb-md">
    <b class="text-subtitle2 text-weight-bold">{{ likes }} likes</b>
    <div><b>authorName</b> {{ description }}</div>
    <div class="column gap-1">
      <FeedPostComment v-for="comment in 10" :key="comment" :comment="comment" minimized />
    </div>
    <div class="text-caption text-blue-grey-4">{{ formatDate(createdAt, DateTypes.DIFF) }}</div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useFormat, DateTypes } from 'src/composables/format/useFormat';
import { CommentModel } from 'src/models/post/comment.model';
import FeedPostComment from 'components/feed/post/FeedPostComment.vue';

export default defineComponent({
  name: 'FeedPostInfo',

  components: { FeedPostComment },

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
      type: Number,
      required: true,
    },
    comments: {
      type: Array as PropType<CommentModel[]>,
      required: true,
    },
  },

  setup() {
    const { formatDate } = useFormat();

    function toggleLike() {
      //
    }

    return {
      formatDate,
      DateTypes,

      toggleLike,
    };
  },
});
</script>

<style scoped></style>
