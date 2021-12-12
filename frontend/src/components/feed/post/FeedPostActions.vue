<template>
  <div class="flex-center-between q-pr-sm q-py-sm" style="padding-left: 6px">
    <div>
      <BaseButton
        size="16px"
        :icon="isViewerLiked ? 'favorite' : 'favorite_border'"
        :tooltip="isViewerLiked ? 'Remove like' : 'Like'"
        unelevated
        dense
        round
        @click="toggleLike"
      />
      <BaseButton
        class="icon--post-detail"
        icon="forum"
        size="16px"
        tooltip="Show comments"
        unelevated
        dense
        round
        @click="openPostDetail"
      />
      <CommonIconMessages tooltip="Share" />
    </div>

    <BaseButton
      size="16px"
      :icon="isViewerBookmarked ? 'bookmark' : 'bookmark_border'"
      :tooltip="isViewerBookmarked ? 'Remove from bookmarks' : 'Save to bookmarks'"
      unelevated
      dense
      round
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import CommonIconMessages from 'components/common/CommonIconMessages.vue';

export default defineComponent({
  name: 'FeedPostActions',

  components: {
    CommonIconMessages,
  },

  props: {
    isViewerLiked: Boolean,
    isViewerBookmarked: Boolean,
  },

  setup() {
    function toggleLike() {
      //
    }
    function openPostDetail() {
      //
    }

    return {
      toggleLike,
      openPostDetail,
    };
  },
});
</script>

<style lang="scss" scoped>
.icon--post-detail ::v-deep i {
  padding-top: 4px;
}
</style>
