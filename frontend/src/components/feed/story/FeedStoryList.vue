<template>
  <q-card class="feed-story-list" bordered flat>
    <CommonNavigationButton v-if="!useSkeleton" class="navigation--previous" type="previous" />

    <slot />

    <CommonNavigationButton v-if="!useSkeleton" class="navigation--next" type="next" />
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CommonNavigationButton from 'components/common/CommonNavigationButton.vue';

export default defineComponent({
  name: 'FeedStoryList',

  components: {
    CommonNavigationButton,
  },

  props: {
    useSkeleton: Boolean,
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.feed-story-list {
  position: relative;
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: center;

  padding: 16px 0;
  overflow: hidden;
  background: white;
  border: solid 1px $blue-grey-3;
  %navigation {
    position: absolute;
    margin: auto 0;
    z-index: 1;
    background: white;
  }
  .navigation--previous {
    @extend %navigation;
    left: 16px;
  }
  .navigation--next {
    @extend %navigation;
    right: 16px;
  }
}
</style>
