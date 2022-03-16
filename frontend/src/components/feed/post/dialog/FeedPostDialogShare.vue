<template>
  <BaseDialog small @close="$emit('close')" @click="$emit('close')">
    <template #content>
      <BaseItem label="Share to direct" disabled @click="$emit('close')" />
      <BaseItem label="Share to Facebook" disabled @click="$emit('close')" />
      <BaseItem label="Share to Twitter" disabled @click="$emit('close')" />
      <CommonClipboard :text="postLink" @click="$emit('close')">
        <BaseItem label="Copy link" />
      </CommonClipboard>
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import CommonClipboard from 'components/common/CommonClipboard.vue';
import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'FeedPostDialogShare',

  components: {
    CommonClipboard,
  },

  props: {
    post: {
      type: Object as PropType<PostModel>,
      default: null,
    },
  },

  emits: ['close'],

  setup(props) {
    const postLink = computed(() => `${window.location.href.slice(0, -1)}/post/${props.post.id}`);
    return {
      postLink,
    };
  },
});
</script>
