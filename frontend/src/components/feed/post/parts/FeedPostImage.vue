<template>
  <div
    class="feed-post-image relative-position"
    :class="[{ 'feed-post-image--detail': mode === 'detail' }, { 'feed-post-image--page': mode === 'page' }]"
    @dblclick="toggleLike"
  >
    <q-img class="feed-post-image__original" :src="src" @load="isShowBlurredBackground = true" />
    <div
      v-if="isShowBlurredBackground && mode !== 'feed'"
      class="feed-post-image__blurred"
      :style="{ background: `url(${src})` }"
    />
    <div v-show="likeLocalAnimationKey > 0" :key="likeLocalAnimationKey" class="feed-post-image__like">
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

    mode: {
      type: String,
      default: 'feed',
      validator: (v: string): boolean => {
        return ['feed', 'detail', 'page'].includes(v);
      },
    },
  },

  setup(props) {
    const store = useStore();

    const isShowBlurredBackground = ref(false);

    const likeLocalAnimationKey = ref(0);
    function toggleLike() {
      likeLocalAnimationKey.value++;
      if (!props.isViewerLiked) void store.dispatch('post/toggleLike', props.postId);
    }

    return {
      isShowBlurredBackground,

      likeLocalAnimationKey,
      toggleLike,
    };
  },
});
</script>

<style lang="scss" scoped>
.feed-post-image {
  display: flex;
  align-items: center;
  overflow: hidden;
  border-radius: 0;
  &--detail {
    max-height: calc(100vh - 48px);
    max-width: calc(100vh - 48px);
    min-height: calc(100vh - 48px);
    background: black;
  }
  &--page {
    min-height: 70vh;
    background: black;
  }

  &__original {
    z-index: 1;
  }
  &__blurred {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    filter: blur(5px);
    box-shadow: inset 0 0 200px #000000;
    margin: -8px -16px -16px -8px;
  }

  &__like {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    z-index: 10;
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
