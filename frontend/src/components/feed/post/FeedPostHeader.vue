<template>
  <div class="flex-center-between gap-4 q-pl-md q-pr-sm q-py-sm">
    <div class="flex-center gap-3">
      <BaseAvatar size="32px" :src="avatar" :item-name="username" :item-color="color" />
      <div class="text-weight-medium">{{ username }}</div>
    </div>

    <BaseButtonMore flat>
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
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import BaseMenu from 'components/base/BaseMenu.vue';

export default defineComponent({
  name: 'FeedPostHeader',
  components: { BaseMenu },
  props: {
    avatar: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isViewerFollowed: Boolean,
  },
});
</script>
