<template>
  <div class="flex-center-between q-pr-sm q-py-sm" style="padding-left: 6px">
    <div>
      <BaseButton
        size="16px"
        :text-color="isViewerLiked ? 'red' : ''"
        :icon="isViewerLiked ? 'favorite' : 'favorite_border'"
        :tooltip="isViewerLiked ? 'Remove like' : 'Like'"
        tooltip-top-position
        dense
        @click="toggleLike"
      />
      <BaseButton
        class="icon--post-detail"
        icon="forum"
        size="16px"
        tooltip="Show comments"
        tooltip-top-position
        dense
        @click="$emit('open-post')"
      />
      <CommonIconMessages tooltip="Share" tooltip-top-position @click="$emit('share-to-user')" />
    </div>

    <BaseButton
      size="16px"
      :icon="isViewerSaved ? 'bookmark' : 'bookmark_border'"
      :tooltip="isViewerSaved ? 'Remove from bookmarks' : 'Save to bookmarks'"
      tooltip-top-position
      dense
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStore } from 'src/store';

import CommonIconMessages from 'components/common/CommonIconMessages.vue';

export default defineComponent({
  name: 'FeedPostActions',

  components: {
    CommonIconMessages,
  },

  props: {
    postId: {
      type: Number,
      required: true,
    },
    isViewerLiked: Boolean,
    isViewerSaved: Boolean,
  },

  emits: ['open-post', 'share-to-user', 'toggle-like'],

  setup(props, { emit }) {
    const store = useStore();

    function toggleLike() {
      emit('toggle-like');
      void store.dispatch('post/toggleLike', props.postId);
    }

    return {
      toggleLike,
    };
  },
});
</script>

<style lang="scss" scoped>
.icon--post-detail ::v-deep i {
  padding-top: 4px;
}
</style>
