<template>
  <BaseButtonMore>
    <BaseMenu>
      <BaseItem v-if="!isOwnPost" label="Report" danger @click="report" />
      <BaseItem
        v-if="!isOwnPost"
        :label="isViewerFollowed ? 'Unfollow' : 'Follow'"
        :danger="isViewerFollowed"
        :loading="isViewerFollowed ? loading.custom.follow : loading.custom.unfollow"
        @click="isViewerFollowed ? unfollow() : follow()"
      />

      <BaseItem v-if="isOwnPost" label="Delete" danger @click="$emit('delete')" />
      <BaseItem v-if="isOwnPost" label="Edit" @click="$emit('edit')" />

      <BaseItem label="Share to..." @click="$emit('share')" />
      <CommonClipboard copy-url>
        <BaseItem label="Copy link" />
      </CommonClipboard>

      <BaseItem label="Cancel" />
    </BaseMenu>
  </BaseButtonMore>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'src/store';
import useLoading from 'src/composables/common/useLoading';

import CommonClipboard from 'components/common/CommonClipboard.vue';

export default defineComponent({
  name: 'FeedPostMoreButton',

  components: {
    CommonClipboard,
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
  },

  emits: ['delete', 'edit', 'share'],

  setup(props) {
    const store = useStore();
    const loading = useLoading({ customNames: ['follow', 'unfollow'] });

    const isOwnPost = computed(() => props.authorId === store.state.user.currentUser?.id);
    const isViewerFollowed = computed(() => store.state.user.currentUser?.followedUsersIDs.includes(props.authorId));

    function report() {
      console.log('report', props.postId);
    }
    async function follow() {
      try {
        loading.start('follow');
        await store.dispatch('user/follow', props.authorId);
      } finally {
        loading.stop('follow');
      }
    }
    async function unfollow() {
      try {
        loading.start('unfollow');
        await store.dispatch('user/unfollow', props.authorId);
      } finally {
        loading.stop('unfollow');
      }
    }

    return {
      loading,

      isOwnPost,
      isViewerFollowed,

      report,
      follow,
      unfollow,
    };
  },
});
</script>
