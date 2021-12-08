<template>
  <div class="feed-story">{{ story }}</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeedStory',

  props: {
    story: {
      type: Object,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.feed-story {
  width: 80px;
}
</style>
