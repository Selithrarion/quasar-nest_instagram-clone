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
        :avatar="post.author?.avatar?.url"
        :username="post.author.username"
        :color="post.author.color"
        :is-viewer-followed="post.isViewerFollowed"
        @share="$emit('share')"
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
        :author-name="post.author.username"
        :description="post.description"
        :likes="post.likesUserIDs.length"
        :comments="post.comments"
        :created-at="post.createdAt"
        clamp-description
        minimized-comments
        @open-post="$emit('open-post')"
      />
      <FeedPostCommentInput :post-id="post.id" />
    </template>
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import FeedPostHeader from 'components/feed/post/FeedPostHeader.vue';
import FeedPostImage from 'components/feed/post/FeedPostImage.vue';
import FeedPostInfo from 'components/feed/post/FeedPostInfo.vue';
import FeedPostActions from 'components/feed/post/FeedPostActions.vue';
import FeedPostCommentInput from 'components/feed/post/FeedPostCommentInput.vue';

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

  emits: ['open-post', 'share', 'share-to-user'],
});
</script>

<style lang="scss" scoped>
.feed-post {
  background: white;
  width: 100%;
}
</style>
