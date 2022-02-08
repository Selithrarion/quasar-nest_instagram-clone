<template>
  <div class="column gap-1">
    <div class="flex-center-between gap-2 text-caption">
      <div class="text-weight-medium">Suggestions For You</div>
      <BaseButton label="See All" plain-style @click="openExplorePeoplePage" />
    </div>

    <div>
      <CommonUser
        v-for="user in suggestions"
        :key="user.id"
        class="q-px-xs"
        size="32px"
        :user="user"
        hide-name
        @click="openProfile(user.username)"
      >
        <template #name> {{ user.suggestion }} </template>
      </CommonUser>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/store';

import CommonUser from 'components/common/CommonUser.vue';

export default defineComponent({
  name: 'FeedSidebarRecommendations',

  components: {
    CommonUser,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const suggestions = computed(() => store.state.user.suggestions);

    function openExplorePeoplePage() {
      void router.push('/explore/people');
    }
    function openProfile(username: string) {
      void router.push(`/profile/${username}`);
    }

    return {
      suggestions,
      openExplorePeoplePage,
      openProfile,
    };
  },
});
</script>
