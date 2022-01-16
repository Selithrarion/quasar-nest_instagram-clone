<template>
  <div class="row justify-between gap-2 no-wrap">
    <div>
      <b> {{ comment.author.username }} </b>
      {{ comment.text }}
    </div>

    <BaseButton
      class="self-center"
      size="8px"
      :text-color="comment % 2 ? 'red' : ''"
      :icon="comment % 2 ? 'favorite' : 'favorite_border'"
      :tooltip="comment % 2 ? 'Remove like' : 'Like'"
      dense
      @click="toggleLike"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { CommentModel } from 'src/models/feed/comment.model';

export default defineComponent({
  name: 'FeedPostComment',

  props: {
    comment: {
      type: Object as PropType<CommentModel>,
      required: true,
    },
    minimized: Boolean,
  },

  setup() {
    function toggleLike() {
      //
    }

    return {
      toggleLike,
    };
  },
});
</script>

<style scoped></style>
