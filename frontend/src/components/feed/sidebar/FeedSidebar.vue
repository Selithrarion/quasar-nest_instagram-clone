<template>
  <aside class="feed-sidebar">
    <div class="column gap-2">
      <CommonUser
        class="q-px-xs"
        :avatar="currentUser?.avatar?.url"
        :color="currentUser.color"
        :username="currentUser.username"
        :name="currentUser.name"
        @click="openCurrentUserProfile"
      />

      <FeedSidebarRecommendations />

      <FeedSidebarFooter />
    </div>
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

  setup() {
    const store = useStore();
    const router = useRouter();

    const currentUser = computed(() => store.state.user.currentUser);
    async function openCurrentUserProfile() {
      if (currentUser.value) await router.push(`/${currentUser.value.username}`);
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
