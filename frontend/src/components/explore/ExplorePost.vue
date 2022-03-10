<template>
  <div class="explore-post">
    <q-img :src="post.fileURL" ratio="1" />
    <div class="explore-post__content absolute-center flex-center gap-8 full-height full-width">
      <div class="flex-center gap-2">
        <q-icon name="favorite" size="22px" />
        {{ post.likesNumber }}
      </div>
      <div class="flex-center gap-2">
        <q-icon name="forum" size="22px" />
        {{ post.commentsNumber }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'ExplorePost',

  props: {
    post: {
      type: Object as PropType<PostModel>,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>

<style lang="scss" scoped>
.explore-post {
  position: relative;
  width: 30%;
  cursor: pointer;
  &:hover {
    .explore-post__content {
      opacity: 1;
    }
  }
  &:active {
    .explore-post__content {
      background: rgba(12, 7, 48, 0.36);
    }
  }
  &__content {
    font-size: 16px;
    font-weight: 700;
    color: white;
    opacity: 0;
    background: rgba(25, 18, 78, 0.26);
    transition: background-color 100ms ease-in;
  }
}
</style>
