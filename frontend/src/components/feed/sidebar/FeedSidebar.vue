<template>
  <aside class="feed-sidebar">
    <template v-if="useSkeleton">
      <div class="row items-center gap-2">
        <q-skeleton type="QAvatar" size="56px" />
        <q-skeleton type="text" width="50%" height="20px" />
      </div>

      <div class="column gap-1">
        <div v-for="item in 5" :key="item" class="row items-center gap-2" style="height: 48px">
          <q-skeleton type="QAvatar" size="32px" />
          <q-skeleton type="text" width="50%" height="20px" />
        </div>
      </div>
    </template>

    <template v-else>
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
