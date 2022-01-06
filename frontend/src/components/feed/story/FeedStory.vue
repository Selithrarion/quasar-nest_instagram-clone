<template>
  <div class="feed-story">
    <template v-if="useSkeleton">
      <q-skeleton class="flex-shrink-0" type="QAvatar" size="66px" />
      <q-skeleton type="text" width="100%" class="text-caption" />
    </template>

    <template v-else>
      <BaseAvatar size="66px" src="https://cdn.quasar.dev/img/avatar.png" />
      <div class="feed-story__name text-caption ellipsis">123123123123123123123</div>
    </template>
  </div>
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
    useSkeleton: Boolean,
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.feed-story {
  display: flex;
  flex-flow: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 80px;
  overflow: hidden;
  min-width: 0;

  &__name {
    max-width: 80px;
  }
}
</style>
