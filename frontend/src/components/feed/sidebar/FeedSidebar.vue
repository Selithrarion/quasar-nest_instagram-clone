<template>
  <aside class="feed-sidebar bg-grey-2">
    <div class="content">123</div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeedSidebar',

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.feed-sidebar {
  position: sticky;
  top: 32px;
  flex-basis: 300px;
  flex-grow: 1;
  flex-shrink: 0;
  .content {
    max-height: calc(100vh - 32px * 2);
  }
}
</style>
