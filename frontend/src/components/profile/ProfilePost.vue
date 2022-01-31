<template>
  <div class="profile-post">
    <q-img :src="post.fileURL" ratio="1" />
    <div class="profile-post__content absolute-center flex-center gap-8 full-height full-width">
      <div class="flex-center gap-2">
        <q-icon name="favorite" size="22px" />
        {{ post.likesUserIDs.length }}
      </div>
      <div class="flex-center gap-2">
        <q-icon name="forum" size="22px" />
        {{ post.commentIDs.length }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'ProfilePost',

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
.profile-post {
  position: relative;
  width: 30%;
  cursor: pointer;
  &:hover {
    .profile-post__content {
      opacity: 1;
    }
  }
  &__content {
    font-size: 16px;
    font-weight: 700;
    color: white;
    opacity: 0;
    background: rgba(25, 18, 78, 0.26);
  }
}
</style>
