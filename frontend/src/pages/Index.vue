<template>
  <q-page class="row gap-4 q-px-md no-wrap">
    <template v-if="isLoadingState">
      <div class="feed">
        <FeedStoryList :show-navigation="false">
          <FeedStorySkeleton v-for="story of 20" :key="story" />
        </FeedStoryList>

        <FeedPostList>
          <FeedPostSkeleton v-for="post of 2" :key="post" />
        </FeedPostList>
      </div>

      <FeedSidebarSkeleton />
    </template>

    <template v-else>
      <div class="feed">
        <FeedStoryList>
          <FeedStory v-for="story of 20" :key="story" :story="story" />
        </FeedStoryList>

        <FeedPostList>
          <FeedPost v-for="post of 30" :key="post" :post="post" />
        </FeedPostList>
      </div>

      <FeedSidebar />
    </template>
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
import FeedStorySkeleton from 'components/feed/story/FeedStorySkeleton.vue';

import FeedPostList from 'components/feed/post/FeedPostList.vue';
import FeedPost from 'components/feed/post/FeedPost.vue';
import FeedPostSkeleton from 'components/feed/post/FeedPostSkeleton.vue';

import FeedSidebar from 'components/feed/sidebar/FeedSidebar.vue';
import FeedSidebarSkeleton from 'components/feed/sidebar/FeedSidebarSkeleton.vue';

export default defineComponent({
  name: 'FeedIndex',

  components: {
    FeedStoryList,
    FeedStory,
    FeedStorySkeleton,
    FeedPostList,
    FeedPost,
    FeedPostSkeleton,
    FeedSidebar,
    FeedSidebarSkeleton,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const { t } = useI18n();
    const dialog = useDialog();
    const loading = useLoading();

    const availablePosts = computed(() => store.state.post.posts);
    const isLoadingState = computed(() => store.state.app.isLoadingState);

    onBeforeMount(async () => {
      if (!availablePosts.value) await store.dispatch('post/getAll');
    });

    return {
      dialog,
      loading,
      t,

      availablePosts,
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
