<template>
  <q-page class="row gap-4 q-px-md no-wrap">
    <div class="feed">
      <FeedStoryList :use-skeleton="isLoadingState">
        <FeedStory
          v-if="!isLoadingState"
          :current-user-avatar-url="currentUser.avatar?.url"
          :current-user-username="currentUser.username"
          :current-user-color="currentUser.color"
          use-plus-badge
          @set-image="dialog.open('createStory', { item: $event })"
        >
          <template #name> Your story </template>
        </FeedStory>
        <!--        <FeedStory-->
        <!--          v-for="story of isLoadingState ? 20 : 20"-->
        <!--          :key="story"-->
        <!--          :story="story"-->
        <!--          :use-skeleton="isLoadingState"-->
        <!--          @click="openStory(story)"-->
        <!--        />-->
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

    <FeedStoryDialogCreate
      :model-value="dialog.openedName.value === 'createStory'"
      :image-data="dialog.openedItem.value"
      @close="dialog.close"
    />
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
      :post-id="dialog.openedItem.value?.id"
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
import FeedStoryDialogCreate from 'components/feed/story/FeedStoryDialogCreate.vue';

import FeedPostList from 'components/feed/post/FeedPostList.vue';
import FeedPost from 'components/feed/post/FeedPost.vue';
import FeedPostDialogDetail from 'components/feed/post/FeedPostDialogDetail.vue';
import FeedPostDialogShare from 'components/feed/post/FeedPostDialogShare.vue';
import FeedPostDialogShareToUser from 'components/feed/post/FeedPostDialogShareToUser.vue';

import FeedSidebar from 'components/feed/sidebar/FeedSidebar.vue';

export default defineComponent({
  name: 'FeedIndex',

  components: {
    FeedStoryList,
    FeedStory,
    FeedStoryDialogCreate,

    FeedPostList,
    FeedPost,
    FeedPostDialogDetail,
    FeedPostDialogShare,
    FeedPostDialogShareToUser,

    FeedSidebar,
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

    const currentUser = computed(() => store.state.user.currentUser);

    onBeforeMount(async () => {
      if (!availablePosts.value) await store.dispatch('post/getAll');
    });

    function openStory(storyID: number) {
      if (isLoadingState.value) return;
      void router.push(`/story/${storyID}`);
    }

    return {
      dialog,
      loading,
      t,

      availablePosts,
      availableStories,
      isLoadingState,

      currentUser,

      openStory,
    };
  },
});
</script>

<style lang="scss">
.feed {
  display: flex;
  flex-flow: column;
  gap: 32px;
  flex-grow: 1;
  max-width: 655px;
}
</style>
