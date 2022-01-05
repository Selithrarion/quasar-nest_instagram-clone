<template>
  <BaseButtonMore>
    <BaseMenu>
      <BaseItem label="Report" danger @click="report" />
      <BaseItem
        :label="isViewerFollowed ? 'Unfollow' : 'Follow'"
        :danger="isViewerFollowed"
        @click="isViewerFollowed ? unfollow : follow"
      />
      <BaseItem label="Share to..." @click="$emit('share')" />
      <BaseItem>
        <CommonClipboard copy-url> Copy link </CommonClipboard>
      </BaseItem>
      <!--<BaseItem label="Embed" />-->
      <BaseItem label="Cancel" />
    </BaseMenu>
  </BaseButtonMore>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
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
    isViewerFollowed: Boolean,
  },

  emits: ['share'],

  setup(props) {
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
      report,
      follow,
      unfollow,
    };
  },
});
</script>
