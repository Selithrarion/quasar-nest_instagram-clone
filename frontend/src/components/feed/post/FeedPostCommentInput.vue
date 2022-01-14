<template>
  <div class="row gap-2 q-pl-md q-pr-sm q-pb-sm">
    <q-input ref="input" v-model="text" class="flex-grow-1" placeholder="Add a comment..." filled autogrow dense>
      <template #prepend>
        <CommonEmojiPicker v-model="text" />
      </template>
    </q-input>

    <div class="flex-center">
      <BaseButton label="Post" color="primary" :loading="loading.active.value" flat @click="addComment" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import useLoading from 'src/composables/common/useLoading';

import CommonEmojiPicker from 'components/common/CommonEmojiPicker.vue';

import postRepository from 'src/repositories/postRepository';

export default defineComponent({
  name: 'FeedPostCommentInput',

  components: {
    CommonEmojiPicker,
  },

  props: {
    postId: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const loading = useLoading();

    const input = ref<HTMLInputElement>();

    const text = ref('');
    async function addComment() {
      if (!text.value.trim()) {
        text.value = '';
        return;
      }

      try {
        loading.start();
        await postRepository.createComment(text.value, props.postId);
        text.value = '';
      } finally {
        loading.stop();
      }
    }

    function focusInput() {
      input.value?.focus();
    }

    return {
      loading,

      input,

      text,
      addComment,
      focusInput,
    };
  },
});
</script>
