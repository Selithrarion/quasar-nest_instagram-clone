<template>
  <q-page class="explore q-pa-xl">
    <BaseLoader v-if="loading.active.value" page-margin />

    <template v-else>
      <ExploreHeader
        :profile="{ avatar: { url: posts[0].fileURL }, postsNumber: tag.postsNumber, username: `#${tag.name}` }"
      />

      <ExplorePostList v-if="posts.length">
        <ExplorePost
          v-for="post in posts"
          :key="post.id"
          :post="post"
          @click="dialog.open('postDetail', { item: post })"
        />
      </ExplorePostList>
      <div v-else class="text-subtitle1 text-blue-grey-4 text-center">There's no posts</div>
    </template>

    <FeedPostDetail
      :model-value="dialog.openedName.value === 'postDetail'"
      :post="dialog.openedItem.value"
      @edit="updatePost"
      @close="dialog.close"
      @toggle-follow="toggleFollow"
      @toggle-like="toggleLike"
    />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import useDialog from 'src/composables/common/useDialog';
import useLoading from 'src/composables/common/useLoading';

import ExplorePostList from 'components/explore/ExplorePostList.vue';
import ExplorePost from 'components/explore/ExplorePost.vue';
import ExploreHeader from 'components/explore/ExploreHeader.vue';
import FeedPostDetail from 'components/feed/post/detail/FeedPostDetail.vue';

import { PostModel } from 'src/models/feed/post.model';
import postRepository from 'src/repositories/postRepository';
import { PaginationMeta } from 'src/models/common/pagination.model';
import { TagModel } from 'src/models/feed/tag.model';

export default defineComponent({
  name: 'ExplorePage',

  components: {
    ExplorePostList,
    ExplorePost,
    ExploreHeader,
    FeedPostDetail,
  },

  setup() {
    const dialog = useDialog();
    const route = useRoute();
    const loading = useLoading();

    const tag = ref<TagModel | null>(null);
    const posts = ref<PostModel[]>([]);
    const postsMeta = ref<PaginationMeta | null>(null);

    async function loadPageData() {
      loading.start();
      tag.value = await postRepository.getTagByName(String(route.params.tag));
      const { items, meta } = await postRepository.getAll({
        page: 1,
        limit: 10,
        tag: String(route.params.tag),
      });
      posts.value = items;
      postsMeta.value = meta;
      loading.stop();
    }
    onBeforeMount(async () => {
      await loadPageData();
    });
    watch(
      () => route.params.tag,
      () => loadPageData()
    );

    function updatePost(updatedPost: PostModel) {
      if (!posts.value) return;

      const openedPost = dialog.openedItem.value as PostModel;
      const postIndex = posts.value.findIndex((p) => p.id === openedPost?.id);
      posts.value[postIndex] = { ...posts.value[postIndex], ...updatedPost };
    }
    function toggleFollow() {
      if (!posts.value) return;

      const openedPost = dialog.openedItem.value as PostModel;
      const postIndex = posts.value.findIndex((p) => p.id === openedPost?.id);
      posts.value[postIndex].author.isViewerFollowed = !posts.value[postIndex].author.isViewerFollowed;
    }
    function toggleLike() {
      console.log('toggle');
      if (!posts.value) return;

      const openedPost = dialog.openedItem.value as PostModel;
      const postIndex = posts.value.findIndex((p) => p.id === openedPost?.id);
      posts.value[postIndex].isViewerLiked = !posts.value[postIndex].isViewerLiked;
      posts.value[postIndex].isViewerLiked
        ? posts.value[postIndex].likesNumber++
        : posts.value[postIndex].likesNumber--;
    }

    return {
      dialog,
      loading,

      tag,
      posts,
      updatePost,
      toggleFollow,
      toggleLike,
    };
  },
});
</script>

<style lang="scss" scoped>
.explore {
  display: flex;
  flex-flow: column;
  gap: 64px;
}
</style>
