<template>
  <q-img :src="url" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'FeedPostImage',

  props: {
    url: {
      type: String,
      default: null,
    },
  },

  setup() {
    return {};
  },
});
</script>

<style scoped></style>
