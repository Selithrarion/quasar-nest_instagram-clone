<template>
  <q-page class="explore q-pa-xl">
    <ExploreHeader :profile="{}" />

    <ExplorePostList v-if="posts.length">
      <ExplorePost
        v-for="post in posts"
        :key="post.id"
        :post="post"
        @click="dialog.open('postDetail', { item: post })"
      />
    </ExplorePostList>
    <div v-else class="text-subtitle1 text-blue-grey-4 text-center">There's no posts</div>

    <FeedPostDialogDetail
      :model-value="dialog.openedName.value === 'postDetail'"
      :post="dialog.openedItem.value"
      @edit="updatePost"
      @close="dialog.close"
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
import FeedPostDialogDetail from 'components/feed/post/dialog/FeedPostDialogDetail.vue';

import { PostModel } from 'src/models/feed/post.model';
import postRepository from 'src/repositories/postRepository';
import { PaginationData, PaginationMeta } from 'src/models/common/pagination.model';

export default defineComponent({
  name: 'ExplorePage',

  components: {
    ExplorePostList,
    ExplorePost,
    ExploreHeader,
    FeedPostDialogDetail,
  },

  setup() {
    const dialog = useDialog();
    const route = useRoute();
    const loading = useLoading();

    const posts = ref<PostModel[]>([]);
    const postsMeta = ref<PaginationMeta | null>(null);

    async function loadPosts() {
      loading.start();
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
      await loadPosts();
    });
    watch(
      () => route.params.tag,
      () => loadPosts()
    );

    function updatePost(updatedPost: PostModel) {
      if (!posts.value) return;

      const openedPost = dialog.openedItem.value as PostModel;
      const postIndex = posts.value.findIndex((p) => p.id === openedPost?.id);
      posts.value[postIndex] = { ...posts.value[postIndex], ...updatedPost };
    }

    return {
      dialog,
      loading,

      posts,
      updatePost,
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
