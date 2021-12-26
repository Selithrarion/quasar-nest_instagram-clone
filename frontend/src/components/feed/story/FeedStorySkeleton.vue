<template>
  <div class="flex gap-1">
    <q-skeleton class="flex-shrink-0" type="QAvatar" size="66px" />
    <q-skeleton type="text" width="100%" class="text-caption" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeedStorySkeleton',
});
</script>
