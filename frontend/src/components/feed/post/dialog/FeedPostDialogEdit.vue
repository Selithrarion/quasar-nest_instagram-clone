<template>
  <BaseDialog
    title="Edit post"
    :model-value="modelValue"
    :confirm-loading="loading.active.value"
    @close="$emit('close')"
    @confirm="updatePost"
  >
    <q-input v-model="localDescription" label="Description" autogrow filled counter />
  </BaseDialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { useStore } from 'src/store';
import useLoading from 'src/composables/common/useLoading';

import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'FeedPostDialogEdit',

  props: {
    modelValue: Boolean,
    post: {
      type: Object as PropType<PostModel>,
      default: null,
    },
  },

  emits: ['close', 'edit'],

  setup(props, { emit }) {
    const store = useStore();
    const loading = useLoading();

    watch(
      () => props.modelValue,
      () => {
        localDescription.value = props.post?.description || '';
      }
    );
    const localDescription = ref('');

    async function updatePost() {
      try {
        loading.start();

        const payload = {
          description: localDescription.value,
        };
        await store.dispatch('post/update', { id: props.post.id, payload });

        emit('edit', payload);
        emit('close');
      } finally {
        loading.stop();
      }
    }

    return {
      loading,

      localDescription,
      updatePost,
    };
  },
});
</script>
