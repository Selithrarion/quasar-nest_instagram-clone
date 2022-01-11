<template>
  <div class="feed-story" @click="handleStoryClick">
    <template v-if="useSkeleton">
      <q-skeleton class="flex-shrink-0" type="QAvatar" size="66px" />
      <q-skeleton type="text" width="100%" class="text-caption" />
    </template>

    <template v-else>
      <BaseAvatar
        size="66px"
        :item-name="currentUserUsername || story.author.username"
        :item-color="currentUserColor || story.author.color"
        :src="currentUserUsername ? currentUserAvatarUrl : story.author?.avatar?.url"
      >
        <template v-if="usePlusBadge" #badge>
          <!--TODO: refactor badge styles-->
          <input class="hidden" ref="fileInput" type="file" name="image" accept="image/*" @change="setImage" />
          <q-badge
            style="margin-top: 52px; margin-right: 2px; padding: 2px; border: 1px solid white"
            color="primary"
            rounded
            floating
          >
            <q-icon name="add" />
          </q-badge>
        </template>
      </BaseAvatar>
      <div class="feed-story__name text-caption ellipsis">
        <slot name="name"> 123123123123123123123 </slot>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { StoryModel } from 'src/models/feed/story.model';

export default defineComponent({
  name: 'FeedStory',

  props: {
    story: {
      type: Object as PropType<StoryModel>,
      default: null,
    },

    currentUserAvatarUrl: {
      type: String,
      required: false,
      default: null,
    },
    currentUserUsername: {
      type: String,
      required: false,
      default: null,
    },
    currentUserColor: {
      type: String,
      required: false,
      default: null,
    },
    usePlusBadge: Boolean,

    useSkeleton: Boolean,
  },

  emits: ['set-image'],

  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null);
    function handleStoryClick() {
      if (props.usePlusBadge) fileInput.value?.click();
    }
    function setImage($event: Event) {
      const file = (<HTMLInputElement>$event.target)?.files?.[0];

      if (!file) return;
      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader !== 'function') alert('Sorry, FileReader API not supported');

      const reader = new FileReader();
      reader.onload = ($readerEvent: Event) => {
        const target = $readerEvent.target as EventTarget & { result: string };
        emit('set-image', target.result);
      };
      reader.readAsDataURL(file);
    }

    return {
      fileInput,
      handleStoryClick,
      setImage,
    };
  },
});
</script>

<style lang="scss" scoped>
.feed-story {
  display: flex;
  flex-flow: column;
  gap: 4px;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  width: 80px;
  overflow: hidden;
  min-width: 0;

  cursor: pointer;

  &__name {
    max-width: 80px;
  }
}
</style>
