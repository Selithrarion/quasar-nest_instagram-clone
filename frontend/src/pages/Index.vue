<template>
  <q-page class="row gap-4 q-px-md no-wrap">
    <div class="feed">
      <FeedStoryList :use-skeleton="isLoadingState">
        <FeedStory
          v-for="story of isLoadingState ? 20 : 20"
          :key="story"
          :story="story"
          :use-skeleton="isLoadingState"
        />
      </FeedStoryList>

      <FeedPostList>
        <FeedPost
          v-for="post of isLoadingState ? 3 : availablePosts"
          :key="post"
          :post="post"
          :use-skeleton="isLoadingState"
          @share="dialog.open('share', { item: post })"
          @share-to-user="dialog.open('shareToUser', { item: post })"
          @open-post="dialog.open('postDetail', { item: post })"
        />
      </FeedPostList>
    </div>

    <FeedSidebar :use-skeleton="isLoadingState" />

    <FeedPostDialogDetail
      :model-value="dialog.openedName.value === 'postDetail'"
      :post="dialog.openedItem.value"
      @share="dialog.open('share', { item: dialog.openedItem.value })"
      @close="dialog.close"
    />
    <FeedPostDialogShare
      :model-value="dialog.openedName.value === 'share'"
      :post="dialog.openedItem.value"
      @close="dialog.close"
    />
    <FeedPostDialogShareToUser
      :model-value="dialog.openedName.value === 'shareToUser'"
      :post="dialog.openedItem.value"
      @close="dialog.close"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'src/store';
import { useI18n } from 'vue-i18n';
import useDialog from 'src/composables/common/useDialog';
import useLoading from 'src/composables/common/useLoading';

import FeedStoryList from 'components/feed/story/FeedStoryList.vue';
import FeedStory from 'components/feed/story/FeedStory.vue';

import FeedPostList from 'components/feed/post/FeedPostList.vue';
import FeedPost from 'components/feed/post/FeedPost.vue';

import FeedSidebar from 'components/feed/sidebar/FeedSidebar.vue';

import FeedPostDialogDetail from 'components/feed/post/FeedPostDialogDetail.vue';
import FeedPostDialogShare from 'components/feed/post/FeedPostDialogShare.vue';
import FeedPostDialogShareToUser from 'components/feed/post/FeedPostDialogShareToUser.vue';

export default defineComponent({
  name: 'FeedIndex',

  components: {
    FeedStoryList,
    FeedStory,

    FeedPostList,
    FeedPost,

    FeedSidebar,

    FeedPostDialogDetail,
    FeedPostDialogShare,
    FeedPostDialogShareToUser,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const { t } = useI18n();
    const dialog = useDialog();
    const loading = useLoading();

    const availablePosts = computed(() => store.state.post.posts);
    const availableStories = computed(() => []);
    const isLoadingState = computed(() => store.state.app.isLoadingState);

    onBeforeMount(async () => {
      if (!availablePosts.value) await store.dispatch('post/getAll');
    });

    return {
      dialog,
      loading,
      t,

      availablePosts,
      availableStories,
      isLoadingState,
    };
  },
});
</script>

<style lang="scss">
.feed {
  display: flex;
  flex-flow: column;
  gap: 32px;
  max-width: 655px;
}
</style>
