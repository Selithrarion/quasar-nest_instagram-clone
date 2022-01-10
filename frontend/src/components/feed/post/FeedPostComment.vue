<template>
  <div class="row justify-between gap-2 no-wrap">
    <div>
      <b> 123123123123 </b>
      <span>
        flex-wrap flex-wrap fleex-wrap fleex-wrap fleex-wrap flex-wrap flex-wrap flex-wrap flex-wrap flex-wrap flex-wrap
      </span>
    </div>

    <BaseButton
      class="self-center"
      size="8px"
      :text-color="comment % 2 ? 'red' : ''"
      :icon="comment % 2 ? 'favorite' : 'favorite_border'"
      :tooltip="comment % 2 ? 'Remove like' : 'Like'"
      unelevated
      dense
      round
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
