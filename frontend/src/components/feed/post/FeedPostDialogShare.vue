<template>
  <BaseDialog large v-bind="$attrs" @close="$emit('close')">
    <template #content> share me!!! </template>
  </BaseDialog>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PostModel } from 'src/models/post/post.model';

export default defineComponent({
  name: 'FeedPostDialogShare',

  props: {
    post: {
      type: Object as PropType<PostModel>,
      default: null,
    },
  },

  emits: ['close'],

  setup() {
    return {};
  },
});
</script>
