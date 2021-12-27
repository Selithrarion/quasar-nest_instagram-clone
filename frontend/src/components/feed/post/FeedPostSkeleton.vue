<template>
  <q-card class="full-width" bordered flat>
    <q-card-section class="row items-center gap-3 q-pl-md q-pr-sm">
      <q-skeleton type="QAvatar" size="32px" />
      <q-skeleton type="text" width="100px" height="20px" />
    </q-card-section>

    <q-skeleton height="500px" square />

    <q-card-section>
      <q-skeleton type="text" class="text-subtitle1" />
      <q-skeleton type="text" width="50%" class="text-subtitle1" />
      <q-skeleton type="text" class="text-caption" />
    </q-card-section>
  </q-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeedPostSkeleton',
});
</script>
