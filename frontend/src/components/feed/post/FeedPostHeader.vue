<template>
  <div class="flex-center-between gap-4 q-pl-md q-pr-sm q-py-sm">
    <div class="flex-center gap-3 cursor-pointer" @click="openUserPage">
      <BaseAvatar size="32px" :src="avatar" :item-name="username" :item-color="color" clickable />
      <BaseButton class="text-weight-bold" :label="username" plain-style />
    </div>

    <FeedPostMoreButton
      :post-id="postId"
      :author-id="authorId"
      @share="$emit('share')"
      @delete="$emit('delete')"
      @edit="$emit('edit')"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import FeedPostMoreButton from 'components/feed/post/FeedPostMoreButton.vue';

export default defineComponent({
  name: 'FeedPostHeader',

  components: {
    FeedPostMoreButton,
  },

  props: {
    postId: {
      type: Number,
      required: true,
    },
    authorId: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      default: null,
    },
    username: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    isViewerFollowed: Boolean,
  },

  emits: ['delete', 'edit', 'share'],

  setup(props) {
    const router = useRouter();

    async function openUserPage() {
      await router.push(`/${props.username}`);
    }

    return {
      openUserPage,
    };
  },
});
</script>
