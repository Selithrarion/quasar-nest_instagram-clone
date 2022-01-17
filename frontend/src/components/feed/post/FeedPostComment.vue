<template>
  <div class="row justify-between gap-2 no-wrap">
    <div>
      <b> {{ comment.author.username }} </b>
      {{ comment.text }}
    </div>

    <BaseButton
      class="self-center"
      size="8px"
      :text-color="comment % 2 ? 'red' : ''"
      :icon="comment % 2 ? 'favorite' : 'favorite_border'"
      :tooltip="comment % 2 ? 'Remove like' : 'Like'"
      dense
      @click="toggleLike"
    />
  </div>
  <div>
    <CommonUser size="32px" :user="comment.author" :clickable="false">
      <template #username>
        {{ comment.text }}
      </template>
      <template #name>
        <div class="row items-center gap-2">
          <!--          TODO: comment created at date formdat-->
          <div>1 min ago</div>
          <BaseButton label="Reply" size="12px" dense flat />
          <BaseButtonMore size="12px" @click="dialog.open('commentActions')" />
        </div>
      </template>
      <template #append>
        <BaseButton
          class="self-center"
          size="8px"
          :text-color="comment % 2 ? 'red' : ''"
          :icon="comment % 2 ? 'favorite' : 'favorite_border'"
          :tooltip="comment % 2 ? 'Remove like' : 'Like'"
          dense
          @click="toggleLike"
        />
      </template>
    </CommonUser>

    <BaseDialog
      :model-value="dialog.openedName.value === 'commentActions'"
      small
      @close="closeDialog"
      @click="closeDialog"
    >
      <template #content>
        <!--        TODO: add report dialog and report ids-->
        <BaseItem v-if="!isCurrentUserComment" label="Report" danger @click="reportComment" />
        <BaseItem v-if="isCurrentUserComment" label="Delete" danger @click="dialog.open('deleteComment')" />
        <BaseItem v-if="isCurrentUserComment" label="Edit" @click="dialog.open('editComment')" />
        <BaseItem label="Cancel" @click="closeDialog" />
      </template>
    </BaseDialog>

    <BaseDialog
      title="Edit comment"
      :model-value="dialog.openedName.value === 'editComment'"
      :confirm-loading="dialog.loading"
      @close="closeDialog"
      @confirm="updateComment"
    >
      <q-input v-model="localCommentText" filled autogrow />
    </BaseDialog>
    <BaseDialog
      type="delete"
      title="Delete comment"
      :model-value="dialog.openedName.value === 'deleteComment'"
      :confirm-loading="dialog.loading"
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

import CommonUser from 'components/common/CommonUser.vue';

import { CommentModel } from 'src/models/feed/comment.model';
import useDialog from 'src/composables/common/useDialog';

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
    minimized: Boolean,
  },

  setup(props) {
    const store = useStore();
    const dialog = useDialog();

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
        await store.dispatch('post/updateComment', payload);

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

        closeDialog();
      } finally {
        dialog.stopLoading();
      }
    }

    function toggleLike() {
      //
    }

    function closeDialog() {
      localCommentText.value = props.comment.text;
      dialog.close();
    }

    return {
      dialog,

      isCurrentUserComment,

      localCommentText,
      updateComment,
      deleteComment,

      toggleLike,

      closeDialog,
    };
  },
});
</script>
