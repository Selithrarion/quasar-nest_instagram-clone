<template>
  <q-page class="column gap-16 q-pa-xl">
    <BaseLoader v-if="loading.active.value" page-margin />
    <template v-else>
      <FeedPostDetail :model-value="true" mode="page" :post="post" />
    </template>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref, watch } from 'vue';
import useLoading from 'src/composables/common/useLoading';
import { useRoute } from 'vue-router';

import FeedPostDetail from 'components/feed/post/detail/FeedPostDetail.vue';

import postRepository from 'src/repositories/postRepository';
import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'PostDetail',

  components: { FeedPostDetail },

  setup() {
    const route = useRoute();
    const loading = useLoading({ default: true });

    const post = ref<PostModel | null>(null);
    onBeforeMount(async () => {
      const { postID } = route.params;
      post.value = await postRepository.getByID(Number(postID));
      loading.stop();
    });
    watch(
      () => route.params.postID,
      async () => {
        if (!route.params.postID) return;
        loading.start();
        post.value = await postRepository.getByID(Number(Number(route.params.postID)));
        loading.stop();
      }
    );

    return {
      loading,

      post,
    };
  },
});
</script>
