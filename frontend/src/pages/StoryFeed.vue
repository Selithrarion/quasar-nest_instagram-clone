<template>
  <q-page class="bg-grey-10">
    <CommonLogo class="absolute-top-left q-pa-md" white />

    <div class="flex-center window-height q-py-md">
      <StoryItem />
    </div>
  </q-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import CommonLogo from 'components/common/CommonLogo.vue';
import StoryItem from 'components/story/StoryItem.vue';

export default defineComponent({
  name: 'StoryFeed',

  components: {
    CommonLogo,
    StoryItem,
  },

  setup() {
    return {};
  },
});
</script>
