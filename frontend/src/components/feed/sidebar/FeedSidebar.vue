<template>
  <aside class="feed-sidebar">
    <template v-if="useSkeleton">
      <CommonUser class="q-px-xs" use-skeleton />
      <div class="column gap-1">
        <CommonUser v-for="item in 5" :key="item" class="q-px-xs" style="height: 48px" size="32px" use-skeleton />
      </div>
    </template>

    <template v-else>
      <div class="column gap-2">
        <CommonUser class="q-px-xs" :user="currentUser" @click="openCurrentUserProfile" />

        <FeedSidebarRecommendations />

        <FeedSidebarFooter />
      </div>
    </template>
  </aside>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';

import CommonUser from 'components/common/CommonUser.vue';
import FeedSidebarRecommendations from 'components/feed/sidebar/FeedSidebarRecommendations.vue';
import FeedSidebarFooter from 'components/feed/sidebar/FeedSidebarFooter.vue';

export default defineComponent({
  name: 'FeedSidebar',

  components: {
    CommonUser,
    FeedSidebarRecommendations,
    FeedSidebarFooter,
  },

  props: {
    useSkeleton: Boolean,
  },

  setup() {
    const store = useStore();
    const router = useRouter();

    const currentUser = computed(() => store.state.user.currentUser);
    async function openCurrentUserProfile() {
      if (currentUser.value) await router.push(`/profile/${currentUser.value.username}`);
    }

    return {
      currentUser,
      openCurrentUserProfile,
    };
  },
});
</script>

<style lang="scss" scoped>
.feed-sidebar {
  position: sticky;
  top: 98px;
  flex-grow: 1;
  flex-shrink: 0;
  max-height: calc(100vh - 64px * 2);
  max-width: 270px;
}
</style>
