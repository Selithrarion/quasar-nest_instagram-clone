<template>
  <aside class="column gap-2 full-width">
    <div class="row items-center gap-2">
      <q-skeleton type="QAvatar" size="56px" />
      <q-skeleton type="text" width="50%" height="20px" />
    </div>

    <div class="column gap-1">
      <div v-for="item in 5" :key="item" class="row items-center gap-2" style="height: 48px">
        <q-skeleton type="QAvatar" size="32px" />
        <q-skeleton type="text" width="50%" height="20px" />
      </div>
    </div>
  </aside>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeedSidebarSkeleton',

  setup() {
    return {};
  },
});
</script>
