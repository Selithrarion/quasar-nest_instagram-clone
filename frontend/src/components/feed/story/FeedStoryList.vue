<template>
  <div class="feed-story-list">
    <CommonNavigationButton type="previous" />

    <slot />

    <CommonNavigationButton type="next" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CommonNavigationButton from 'components/common/CommonNavigationButton.vue';

export default defineComponent({
  name: 'FeedStoryList',

  components: {
    CommonNavigationButton,
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.feed-story-list {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
  //width: 100%;
  overflow: hidden;
}
</style>
