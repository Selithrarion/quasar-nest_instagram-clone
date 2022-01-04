<template>
  <BaseButtonMore>
    <BaseMenu>
      <BaseItem label="Report" danger />
      <BaseItem :label="isViewerFollowed ? 'Unfollow' : 'Follow'" :danger="isViewerFollowed" />
      <BaseItem label="Go to post" />
      <BaseItem label="Share to..." />
      <BaseItem label="Copy link" />
      <BaseItem label="Embed" />
      <BaseItem label="Cancel" />
    </BaseMenu>
  </BaseButtonMore>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeedPostMoreButton',

  props: {
    isViewerFollowed: Boolean,
  },

  setup() {
    return {};
  },
});
</script>
