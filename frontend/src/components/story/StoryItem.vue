<template>
  <div class="flex-center story-item">
    <div class="flex gap-2">
      <CommonUser :user="story.author" hide-name />
      <div class="text-grey-6">
        {{ story.createdAt }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import CommonUser from 'components/common/CommonUser.vue';
import { StoryModel } from 'src/models/feed/story.model';

export default defineComponent({
  name: 'StoryItem',

  components: {
    CommonUser,
  },

  props: {
    story: {
      type: Object as PropType<StoryModel>,
      default: null,
    },
    isCurrent: Boolean,
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.story-item {
  height: 100%;
  width: 28vw;
  background: $grey-9;
  border-radius: 8px;
}
</style>
