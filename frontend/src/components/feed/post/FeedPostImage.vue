<template>
  <div class="feed-post-image relative-position" @dblclick="toggleLike">
    <q-img :src="src" />
    <div v-show="likeLocalAnimationKey > 0" class="feed-post-image__like" :key="likeLocalAnimationKey">
      <q-icon color="white" name="favorite" size="128px" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useStore } from 'src/store';

export default defineComponent({
  name: 'FeedPostImage',

  props: {
    postId: {
      type: Number,
      required: true,
    },
    src: {
      type: String,
      required: true,
    },
    isViewerLiked: {
      type: Boolean,
      required: true,
    },
  },

  setup(props) {
    const store = useStore();

    const likeLocalAnimationKey = ref(0);
    function toggleLike() {
      likeLocalAnimationKey.value++;
      if (!props.isViewerLiked) void store.dispatch('post/toggleLike', props.postId);
    }

    return {
      likeLocalAnimationKey,
      toggleLike,
    };
  },
});
</script>

<style lang="scss" scoped>
.feed-post-image {
  &__like {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: post-like 1s ease-in-out;
    opacity: 0;
    .q-icon {
      filter: drop-shadow(2px 4px 6px rgba(174, 175, 242, 0.6));
    }
  }

  @keyframes post-like {
    0% {
      transform: scale(0.75, 0.75);
      opacity: 0;
    }
    30% {
      transform: scale(1.25, 1.25);
      opacity: 1;
    }
    40% {
      transform: scale(1, 1);
    }
    70% {
      transform: scale(1.15, 1.15);
    }
    80% {
      opacity: 1;
    }
    90% {
      opacity: 0;
    }
    100% {
      opacity: 0;
      transform: scale(0, 0);
    }
  }
}
</style>
