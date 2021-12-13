<template>
  <div class="flex-center-between gap-4 q-pl-md q-pr-sm q-py-sm">
    <div class="flex-center gap-3 cursor-pointer" @click="openUserPage">
      <BaseAvatar size="32px" :src="avatar" :item-name="username" :item-color="color" clickable />
      <BaseButton class="text-weight-bold" :label="username" plain-style />
    </div>

    <BaseButtonMore flat>
      <BaseMenu>
        <BaseItem label="Report" danger />
        <BaseItem :label="isViewerFollowed ? 'Unfollow' : 'Follow'" :danger="isViewerFollowed" />
        <BaseItem label="Go to post" />
        <BaseItem label="Share to..." />
        <BaseItem label="Copy link" />
        <BaseItem label="Embed" />
        <BaseItem label="Cancel" />
      </BaseMenu>
    </BaseButtonMore>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'FeedPostHeader',

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
