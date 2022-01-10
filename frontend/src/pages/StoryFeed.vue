<template>
  <q-page class="bg-grey-10">
    <CommonLogo class="absolute-top-left q-pa-md" white />

    <div class="flex-center window-height q-py-md">
      <StoryItem v-for="story in stories" :key="story.id" :story="story" :is-current="true" />
    </div>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue';

import CommonLogo from 'components/common/CommonLogo.vue';
import StoryItem from 'components/story/StoryItem.vue';
import { useStore } from 'src/store';

export default defineComponent({
  name: 'StoryFeed',

  components: {
    CommonLogo,
    StoryItem,
  },

  setup() {
    const store = useStore();
    const stories = computed(() => store.state.story.stories);

    onBeforeMount(async () => {
      if (!stories.value) await store.dispatch('story/getAll');
    });

    return {
      stories,
    };
  },
});
</script>
