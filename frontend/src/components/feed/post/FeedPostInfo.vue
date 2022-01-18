<template>
  <div class="column gap-2 q-pl-md q-pr-sm q-pb-md">
    <BaseButton
      class="text-subtitle2 text-weight-bold w-fit-content"
      style="margin-left: -4px"
      dense
      flat
      @click="dialog.open('postLikes')"
    >
      {{ likes }} likes
    </BaseButton>

    <div v-if="!hideDescription" class="break-word">
      <b>{{ authorName }}</b>
      {{ formattedDescription }}
      <BaseButton
        v-if="clampDescriptionLocal && description.length >= 101"
        label="Show more"
        plain-style
        @click="clampDescriptionLocal = false"
      />
    </div>

    <template v-if="comments.length">
      <div class="column gap-1">
        <FeedPostComment v-for="comment in comments" :key="comment" :comment="comment" :minimized="minimizedComments" />
      </div>
      <BaseButton
        v-if="!hideViewAllComments"
        class="text-subtitle2 text-blue-grey-4 w-fit-content"
        style="margin-left: -4px"
        dense
        flat
        @click="$emit('open-post')"
      >
        View all comments ({{ comments.length }})
      </BaseButton>
    </template>

    <div class="text-caption text-blue-grey-4">{{ formatDate(createdAt, DateTypes.DIFF) }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import useDialog from 'src/composables/common/useDialog';
import { useFormat, DateTypes } from 'src/composables/format/useFormat';

import FeedPostComment from 'components/feed/post/FeedPostComment.vue';

import { CommentModel } from 'src/models/feed/comment.model';

export default defineComponent({
  name: 'FeedPostInfo',

  components: {
    FeedPostComment,
  },

  props: {
    authorName: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
      default: '',
    },
    likes: {
      type: Number,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
    comments: {
      type: Array as PropType<CommentModel[]>,
      required: true,
    },

    hideDescription: Boolean,
    hideViewAllComments: Boolean,
    clampDescription: Boolean,
    minimizedComments: Boolean,
  },

  emits: ['open-post'],

  setup(props) {
    const dialog = useDialog();
    const { formatDate } = useFormat();

    const clampDescriptionLocal = ref(props.clampDescription);
    const formattedDescription = computed(() => {
      if (!clampDescriptionLocal.value) return props.description;

      if (props.description.length <= 100) return props.description;
      return props.description.slice(0, 100) + ' ...';
    });

    return {
      dialog,
      formatDate,
      DateTypes,

      clampDescriptionLocal,
      formattedDescription,
    };
  },
});
</script>

<style lang="scss" scoped>
.feed-post-info {
  //&__description--clamp {
  //  display: -webkit-box;
  //  -webkit-line-clamp: 2;
  //  -webkit-box-orient: vertical;
  //  overflow: hidden;
  //}
}
</style>
