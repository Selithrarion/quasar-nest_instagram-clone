<template>
  <div v-if="minimized" class="row justify-between gap-2 no-wrap">
    <div>
      <b> {{ comment.author?.username }} </b>
      {{ comment.text }}
    </div>
  </div>

  <div v-else :style="{ 'margin-left': replyDepth > 10 ? '80px' : `${replyDepth * 8}px` }">
    <CommonUser class="q-px-none" size="32px" :user="comment.author" :clickable="false" align-avatar-to-top>
      <template #username>
        {{ comment.text }}
      </template>
      <template #name>
        <div class="row items-center gap-2">
          <div class="text-caption text-blue-grey-4">{{ formatDate(comment.createdAt, DateTypes.DIFF) }}</div>
          <BaseButton label="Reply" size="12px" dense flat @click="$emit('reply', comment)" />
          <BaseButtonMore size="12px" @click="dialog.open('commentActions')" />
        </div>
      </template>
      <template #append>
        <BaseButton
          class="self-center"
          size="8px"
          :text-color="comment.isViewerLiked ? 'red' : ''"
          :icon="comment.isViewerLiked ? 'favorite' : 'favorite_border'"
          :tooltip="comment.isViewerLiked ? 'Remove like' : 'Like'"
          dense
          @click="toggleLike"
        />
      </template>
    </CommonUser>

    <div v-if="comment.replies?.length">
      <FeedPostComment
        v-for="commentReply in comment.replies"
        :key="commentReply.id"
        :comment="commentReply"
        :reply-depth="replyDepth + 1"
        @reply="$emit('reply', commentReply)"
      />
    </div>

    <BaseDialog
      :model-value="dialog.openedName.value === 'commentActions'"
      small
      @close="closeDialog"
      @click="closeDialog"
    >
      <template #content>
        <!--        TODO: add report dialog and report ids-->
        <BaseItem v-if="!isCurrentUserComment" label="Report" disabled danger @click="reportComment" />
        <BaseItem v-if="isCurrentUserComment" label="Delete" danger @click="dialog.open('deleteComment')" />
        <BaseItem v-if="isCurrentUserComment" label="Edit" @click="dialog.open('editComment')" />
        <BaseItem label="Cancel" @click="closeDialog" />
      </template>
    </BaseDialog>

    <BaseDialog
      title="Edit comment"
      :model-value="dialog.openedName.value === 'editComment'"
      :confirm-loading="dialog.loading.value"
      @close="closeDialog"
      @confirm="updateComment"
    >
      <q-input v-model="localCommentText" filled autogrow />
    </BaseDialog>
    <BaseDialog
      type="delete"
      title="Delete comment"
      :model-value="dialog.openedName.value === 'deleteComment'"
      :confirm-loading="dialog.loading.value"
      @close="closeDialog"
      @confirm="deleteComment"
    >
      Are you sure you want to delete your comment?
    </BaseDialog>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import { useStore } from 'src/store';
import useDialog from 'src/composables/common/useDialog';
import { useFormat, DateTypes } from 'src/composables/format/useFormat';

import CommonUser from 'components/common/CommonUser.vue';

import { CommentModel } from 'src/models/feed/comment.model';

export default defineComponent({
  name: 'FeedPostComment',

  components: {
    CommonUser,
  },

  props: {
    comment: {
      type: Object as PropType<CommentModel>,
      required: true,
    },
    replyDepth: {
      type: Number,
      default: 0,
    },
    minimized: Boolean,
  },

  emits: ['reply', 'toggle-like', 'update', 'delete'],

  setup(props, { emit }) {
    const store = useStore();
    const dialog = useDialog();
    const { formatDate } = useFormat();

    const isCurrentUserComment = computed(() => store.state.user.currentUser?.id === props.comment.author.id);

    const localCommentText = ref(props.comment.text);
    async function updateComment() {
      if (props.comment.text.trim() === localCommentText.value.trim()) {
        closeDialog();
        return;
      }

      try {
        dialog.startLoading();

        const payload = {
          id: props.comment.id,
          text: localCommentText.value,
        };
        const comment = (await store.dispatch('post/updateComment', payload)) as CommentModel;

        emit('update', comment);
        closeDialog();
      } finally {
        dialog.stopLoading();
      }
    }

    async function deleteComment() {
      try {
        dialog.startLoading();

        const payload = {
          commentID: props.comment.id,
          postID: props.comment.postID,
        };
        await store.dispatch('post/deleteComment', payload);
        emit('delete');

        closeDialog();
      } finally {
        dialog.stopLoading();
      }
    }

    function toggleLike() {
      emit('toggle-like', props.comment.id);
      const payload = { commentID: props.comment.id, postID: props.comment.postID };
      void store.dispatch('post/toggleCommentLike', payload);
    }
    function reportComment() {
      //
    }

    function closeDialog() {
      localCommentText.value = props.comment.text;
      dialog.close();
    }

    return {
      dialog,
      formatDate,
      DateTypes,

      isCurrentUserComment,

      localCommentText,
      updateComment,
      deleteComment,

      toggleLike,
      reportComment,

      closeDialog,
    };
  },
});
</script>
