<template>
  <div class="column gap-2 q-pl-md q-pr-sm q-pb-md">
    <BaseButton
      class="text-subtitle2 text-weight-bold w-fit-content"
      style="margin-left: -4px"
      dense
      flat
      @click="dialog.open('postLikes')"
    >
      {{ post.likesUserIDs.length }} likes
    </BaseButton>

    <div v-if="!hideDescription" class="break-word">
      <b>{{ post.author.username }}</b>
      {{ formattedDescription }}
      <BaseButton
        v-if="clampDescriptionLocal && post.description.length >= 101"
        label="Show more"
        plain-style
        @click="clampDescriptionLocal = false"
      />
    </div>

    <template v-if="post.comments.length">
      <BaseButton
        v-if="!hideViewAllComments && post.comments.length !== post.commentIDs.length"
        class="text-subtitle2 text-blue-grey-4 w-fit-content"
        style="margin-left: -4px"
        dense
        flat
        @click="$emit('open-post')"
      >
        View all comments ({{ post.comments.length }})
      </BaseButton>
      <div class="column gap-1">
        <FeedPostComment
          v-for="comment in post.comments"
          :key="comment"
          :comment="comment"
          :minimized="minimizedComments"
          @reply="$emit('reply', comment)"
        />
      </div>
    </template>

    <div class="text-caption text-blue-grey-4">{{ formatDate(post.createdAt, DateTypes.DIFF) }}</div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import useDialog from 'src/composables/common/useDialog';
import { useFormat, DateTypes } from 'src/composables/format/useFormat';

import FeedPostComment from 'components/feed/post/FeedPostComment.vue';

import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'FeedPostInfo',

  components: {
    FeedPostComment,
  },

  props: {
    post: {
      type: Object as PropType<PostModel>,
      required: true,
    },

    hideDescription: Boolean,
    hideViewAllComments: Boolean,
    clampDescription: Boolean,
    minimizedComments: Boolean,
  },

  emits: ['open-post', 'reply'],

  setup(props) {
    const dialog = useDialog();
    const { formatDate } = useFormat();

    const clampDescriptionLocal = ref(props.clampDescription);
    const formattedDescription = computed(() => {
      if (!clampDescriptionLocal.value) return props.post.description;

      if (props.post.description.length <= 100) return props.post.description;
      return props.post.description.slice(0, 100) + ' ...';
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
