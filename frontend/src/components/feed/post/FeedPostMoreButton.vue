<template>
  <BaseButtonMore>
    <BaseMenu>
      <BaseItem v-if="!isOwnPost" label="Report" danger @click="report" />
      <BaseItem
        v-if="!isOwnPost"
        :label="isViewerFollowed ? 'Unfollow' : 'Follow'"
        :danger="isViewerFollowed"
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
    isViewerFollowed: Boolean,
  },

  emits: ['delete', 'edit', 'share'],

  setup(props) {
    const store = useStore();

    const isOwnPost = computed(() => props.authorId === store.state.user.currentUser?.id);

    function report() {
      console.log('report', props.postId);
    }
    function follow() {
      console.log('follow', props.postId);
    }
    function unfollow() {
      console.log('unfollow', props.postId);
    }

    return {
      isOwnPost,

      report,
      follow,
      unfollow,
    };
  },
});
</script>
