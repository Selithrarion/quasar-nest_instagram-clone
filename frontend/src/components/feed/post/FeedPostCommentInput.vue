<template>
  <div class="row gap-2 q-pl-md q-pr-sm q-pb-sm">
    <q-input ref="input" v-model="text" class="flex-grow-1" placeholder="Add a comment..." filled autogrow dense>
      <template #prepend>
        <CommonEmojiPicker v-model="text" />
      </template>
    </q-input>

    <div class="flex-center">
      <BaseButton label="Post" color="primary" flat @click="addComment" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import CommonEmojiPicker from 'components/common/CommonEmojiPicker.vue';

export default defineComponent({
  name: 'FeedPostCommentInput',

  components: {
    CommonEmojiPicker,
  },

  setup() {
    const input = ref<HTMLInputElement>();
    const text = ref('');
    function addComment() {
      //
      text.value = '';
    }

    function focusInput() {
      input.value?.focus();
    }

    return {
      input,
      text,
      addComment,
      focusInput,
    };
  },
});
</script>
