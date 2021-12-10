<template>
  <div class="feed-post-list">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeedPostList',

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.feed-post-list {
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
  gap: 32px;
}
</style>
