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
        <FeedStory
          v-for="story of isLoadingState ? 20 : 0"
          :key="story"
          :story="story"
          :use-skeleton="isLoadingState"
          @click="openStory(story)"
        />
      </FeedStoryList>

      <FeedPostList>
        <FeedPost
          v-for="post of isLoadingState ? 3 : availablePosts"
          :key="post"
          :post="post"
          :use-skeleton="isLoadingState"
          @edit="dialog.open('editPost', { item: post })"
          @delete="dialog.open('deletePost', { item: post })"
          @share="dialog.open('share', { item: post })"
          @share-to-user="dialog.open('shareToUser', { item: post })"
          @report="dialog.open('report', { item: post })"
          @open-post="openPostDetail(post)"
          @open-likes="dialog.open('postLikes', { item: post })"
        />
        <BaseLoader
          v-if="!isLoadingState && !isLastPostsPage"
          v-observe-visibility="{
            callback: loadNextPostsPage,
            throttle: 200,
          }"
          class="q-mb-xl q-mt-lg"
          medium
        />
      </FeedPostList>
    </div>

    <FeedSidebar :use-skeleton="isLoadingState" />

    <FeedStoryDialogCreate
      :model-value="dialog.openedName.value === 'createStory'"
      :image-data="dialog.openedItem.value"
      @close="dialog.close"
    />
    <FeedPostDetail
      :model-value="dialog.openedName.value === 'postDetail'"
      :post="dialog.openedItem.value"
      @close="dialog.close"
      @toggle-follow="toggleFollow(dialog.openedItem.value.id)"
    />

    <BaseDialog
      type="delete"
      title="Delete post"
      :model-value="dialog.openedName.value === 'deletePost'"
      :confirm-loading="dialog.loading.value"
      @close="dialog.close"
      @confirm="deletePost(dialog.openedItem.value.id)"
    >
      Are you sure you want to delete this post?
    </BaseDialog>
    <FeedPostDialogEdit
      :model-value="dialog.openedName.value === 'editPost'"
      :post="dialog.openedItem.value"
      @close="dialog.close"
    />

    <FeedPostDialogLikes
      :model-value="dialog.openedName.value === 'postLikes'"
      :post="dialog.openedItem.value"
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

    <FeedPostDialogReport
      :model-value="dialog.openedName.value === 'report'"
      :post="dialog.openedItem.value"
      @close="dialog.close"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';
import { useI18n } from 'vue-i18n';
import useDialog from 'src/composables/common/useDialog';
import useLoading from 'src/composables/common/useLoading';

import FeedStoryList from 'components/feed/story/FeedStoryList.vue';
import FeedStory from 'components/feed/story/FeedStory.vue';
import FeedStoryDialogCreate from 'components/feed/story/FeedStoryDialogCreate.vue';

import FeedPostList from 'components/feed/post/FeedPostList.vue';
import FeedPost from 'components/feed/post/FeedPost.vue';
import FeedPostDetail from 'components/feed/post/detail/FeedPostDetail.vue';
import FeedPostDialogLikes from 'components/feed/post/dialog/FeedPostDialogLikes.vue';
import FeedPostDialogEdit from 'components/feed/post/dialog/FeedPostDialogEdit.vue';
import FeedPostDialogShare from 'components/feed/post/dialog/FeedPostDialogShare.vue';
import FeedPostDialogShareToUser from 'components/feed/post/dialog/FeedPostDialogShareToUser.vue';
import FeedPostDialogReport from 'components/feed/post/dialog/FeedPostDialogReport.vue';

import FeedSidebar from 'components/feed/sidebar/FeedSidebar.vue';
import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'FeedIndex',

  components: {
    FeedStoryList,
    FeedStory,
    FeedStoryDialogCreate,

    FeedPostList,
    FeedPost,
    FeedPostDetail,
    FeedPostDialogLikes,
    FeedPostDialogEdit,
    FeedPostDialogShare,
    FeedPostDialogShareToUser,
    FeedPostDialogReport,

    FeedSidebar,
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n();
    const dialog = useDialog();
    const loading = useLoading();

    const availablePosts = computed(() => store.state.post.posts);
    const availableStories = computed(() => []);
    const isLoadingState = computed(() => store.state.app.isLoadingState);

    const currentUser = computed(() => store.state.user.currentUser);

    onBeforeMount(async () => {
      if (!availablePosts.value) {
        await Promise.all([store.dispatch('post/getAll'), store.dispatch('user/getSuggestions')]);
      }
    });

    function openPostDetail(post: PostModel) {
      store.commit('post/SET_POST_DETAIL', post);
      dialog.open('postDetail');
    }
    function openStory(storyID: number) {
      if (isLoadingState.value) return;
      void router.push(`/story/${storyID}`);
    }

    async function deletePost(postID: number) {
      try {
        dialog.startLoading();
        await store.dispatch('post/delete', postID);
        dialog.close();
      } finally {
        dialog.stopLoading();
      }
    }
    function toggleFollow(postID: number) {
      if (!availablePosts.value) return;

      const postIndex = availablePosts.value.findIndex((p) => p.id === postID);
      availablePosts.value[postIndex].author.isViewerFollowed =
        !availablePosts.value[postIndex].author.isViewerFollowed;
    }

    const postsMeta = computed(() => store.state.post.postsMeta);
    const postsPagination = ref({
      page: 1,
    });
    const isLastPostsPage = computed(() => postsMeta.value && postsPagination.value.page >= postsMeta.value.totalPages);
    async function loadNextPostsPage(isVisible: boolean) {
      if (!isVisible) return;
      if (loading.active.value) return;

      loading.start();

      postsPagination.value.page++;
      await store.dispatch('post/getAll', postsPagination.value);

      loading.stop();
    }

    return {
      dialog,
      loading,
      t,

      availablePosts,
      availableStories,
      isLoadingState,

      currentUser,

      openPostDetail,
      openStory,

      deletePost,
      toggleFollow,

      isLastPostsPage,
      loadNextPostsPage,
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
