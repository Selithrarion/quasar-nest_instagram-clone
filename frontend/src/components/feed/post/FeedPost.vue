<template>
  <q-card class="feed-post" bordered flat>
    <FeedPostHeader
      :avatar="post.author?.avatar?.url"
      :username="post.author.username"
      :color="post.author.color"
      :is-viewer-followed="post.isViewerFollowed"
    />

    <FeedPostImage :post-id="post.id" :src="post.fileURL" :is-viewer-liked="post.isViewerLiked" />

    <FeedPostActions
      :post-id="post.id"
      :is-viewer-liked="post.isViewerLiked"
      :is-viewer-saved="post.isViewerSaved"
      @open-post="$emit('open-post')"
    />
    <FeedPostInfo
      :author-name="post.author.username"
      :description="post.description"
      :likes="post.likesUserIDs.length"
      :comments="post.comments"
      :created-at="post.createdAt"
      @open-post="$emit('open-post')"
    />
    <FeedPostCommentInput />
  </q-card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import FeedPostHeader from 'components/feed/post/FeedPostHeader.vue';
import FeedPostImage from 'components/feed/post/FeedPostImage.vue';
import FeedPostInfo from 'components/feed/post/FeedPostInfo.vue';
import FeedPostActions from 'components/feed/post/FeedPostActions.vue';
import FeedPostCommentInput from 'components/feed/post/FeedPostCommentInput.vue';

import { PostModel } from 'src/models/post/post.model';

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
  },

  emits: ['open-post'],

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.feed-post {
  background: white;
  width: 100%;
}
</style>
