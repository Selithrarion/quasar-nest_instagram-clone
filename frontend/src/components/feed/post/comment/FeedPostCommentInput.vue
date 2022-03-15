<template>
  <div class="row gap-2 q-pl-md q-pr-sm q-pb-sm">
    <q-input
      ref="input"
      v-model="text"
      class="flex-grow-1"
      :placeholder="`Add a ${replyComment ? 'reply' : 'comment'}...`"
      filled
      autogrow
      dense
    >
      <template #prepend>
        <CommonEmojiPicker v-model="text" />
        <q-chip
          v-if="replyComment"
          class="flex-shrink-0"
          color="blue-grey-3"
          text-color="blue-grey-9"
          :label="`@${replyComment.author?.username}`"
          removable
          square
          @remove="$emit('remove-reply')"
        />
      </template>
    </q-input>

    <div class="flex-center">
      <BaseButton label="Post" color="primary" :loading="loading.active.value" flat @click="createComment" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { useStore } from 'src/store';
import useLoading from 'src/composables/common/useLoading';

import CommonEmojiPicker from 'components/common/CommonEmojiPicker.vue';
import { CommentModel } from 'src/models/feed/comment.model';

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
    replyComment: {
      type: Object as PropType<CommentModel>,
      default: null,
    },
  },

  emits: ['create', 'remove-reply'],

  setup(props, { emit }) {
    const store = useStore();
    const loading = useLoading();

    const input = ref<HTMLInputElement>();

    watch(
      () => props.replyComment?.id,
      () => {
        input.value?.focus();
      }
    );

    const text = ref('');
    async function createComment() {
      if (!text.value.trim()) {
        text.value = '';
        return;
      }

      try {
        loading.start();
        const comment = (await store.dispatch('post/createComment', {
          text: text.value,
          postID: props.postId,
          replyCommentID: props.replyComment?.id,
        })) as CommentModel;
        emit('create', comment);
        emit('remove-reply');
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
      createComment,
      focusInput,
    };
  },
});
</script>
