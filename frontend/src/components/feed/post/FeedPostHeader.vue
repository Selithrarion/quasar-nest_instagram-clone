<template>
  <div class="flex-center-between gap-4 q-pl-md q-pr-sm q-py-sm">
    <div class="flex-center gap-3 cursor-pointer" @click="openUserPage">
      <BaseAvatar size="32px" :src="avatar" :item-name="username" :item-color="color" clickable />
      <BaseButton class="text-weight-bold" :label="username" plain-style />
    </div>

    <FeedPostMoreButton />
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
