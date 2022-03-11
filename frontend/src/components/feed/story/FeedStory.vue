<template>
  <CommonUploader :active="!useSkeleton && usePlusBadge" @set-image="$emit('set-image', $event)">
    <div class="feed-story">
      <template v-if="useSkeleton">
        <q-skeleton class="flex-shrink-0" type="QAvatar" size="66px" />
        <q-skeleton type="text" width="100%" class="text-caption" />
      </template>

      <template v-else>
        <BaseAvatar
          size="66px"
          tooltip="Create story"
          :item-name="currentUserUsername || story.author.username"
          :item-color="currentUserColor || story.author.color"
          :src="currentUserUsername ? currentUserAvatarUrl : story.author?.avatar?.url"
          clickable
        >
          <template v-if="usePlusBadge" #badge>
            <!--TODO: refactor badge styles-->
            <q-badge
              class="z-10"
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
  </CommonUploader>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import CommonUploader from 'components/common/CommonUploader.vue';

import { StoryModel } from 'src/models/feed/story.model';

export default defineComponent({
  name: 'FeedStory',

  components: {
    CommonUploader,
  },

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

  setup() {
    return {};
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
