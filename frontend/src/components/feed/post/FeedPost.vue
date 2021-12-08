<template>
  <div class="feed-post">{{ post }}</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PostModel } from 'src/models/post/post.model';

export default defineComponent({
  name: 'FeedPost',

  props: {
    post: {
      type: Object as PropType<PostModel>,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.feed-post {
  width: 100%;
}
</style>
