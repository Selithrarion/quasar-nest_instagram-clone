<template>
  <div class="row gap-8 wrap">
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ExplorePostList',
});
</script>
