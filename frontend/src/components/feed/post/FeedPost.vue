<template>
  <q-card class="feed-post" bordered flat>
    <template v-if="useSkeleton">
      <q-card-section class="row items-center gap-3 q-pl-md q-pr-sm">
        <q-skeleton type="QAvatar" size="32px" />
        <q-skeleton type="text" width="100px" height="20px" />
      </q-card-section>

      <q-skeleton height="500px" square />

      <q-card-section>
        <q-skeleton type="text" class="text-subtitle1" />
        <q-skeleton type="text" width="50%" class="text-subtitle1" />
        <q-skeleton type="text" class="text-caption" />
      </q-card-section>
    </template>

    <template v-else>
      <FeedPostHeader
        :post-id="post.id"
        :author-id="post.author?.id"
        :avatar="post.author?.avatar?.url"
        :username="post.author.username"
        :color="post.author.color"
        :is-viewer-followed="post.author.isViewerFollowed"
        @delete="$emit('delete')"
        @edit="$emit('edit')"
        @share="$emit('share')"
        @report="$emit('report')"
      />

      <FeedPostImage :post-id="post.id" :src="post.fileURL" :is-viewer-liked="post.isViewerLiked" />

      <FeedPostActions
        :post-id="post.id"
        :is-viewer-liked="post.isViewerLiked"
        :is-viewer-saved="post.isViewerSaved"
        @share-to-user="$emit('share-to-user')"
        @open-post="$emit('open-post')"
      />
      <FeedPostInfo
        :post="post"
        clamp-description
        minimized-comments
        @open-likes="$emit('open-likes')"
        @open-post="$emit('open-post')"
      />
      <FeedPostCommentInput :post-id="post.id" />
    </template>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import FeedPostHeader from 'components/feed/post/parts/FeedPostHeader.vue';
import FeedPostImage from 'components/feed/post/parts/FeedPostImage.vue';
import FeedPostInfo from 'components/feed/post/parts/FeedPostInfo.vue';
import FeedPostActions from 'components/feed/post/parts/FeedPostActions.vue';
import FeedPostCommentInput from 'components/feed/post/comment/FeedPostCommentInput.vue';

import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'FeedPost',

  components: {
    FeedPostHeader,
    FeedPostImage,
    FeedPostInfo,
    FeedPostActions,
    FeedPostCommentInput,
  },

  props: {
    post: {
      type: Object as PropType<PostModel>,
      required: true,
    },
    useSkeleton: Boolean,
  },

  emits: ['open-post', 'open-likes', 'delete', 'edit', 'share', 'share-to-user', 'report'],
});
</script>

<style lang="scss" scoped>
.feed-post {
  background: white;
  width: 100%;
}
</style>
