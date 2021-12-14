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
        :avatar="user?.avatar?.url"
        :color="user.color"
        :username="user.username"
      >
        <template #name> Follows you / Followed by USERNAME / New to Instagram </template>
      </CommonUser>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import CommonUser from 'components/common/CommonUser.vue';

import { UserSuggestionModel } from 'src/models/user/user.model';

export default defineComponent({
  name: 'FeedSidebarRecommendations',

  components: {
    CommonUser,
  },

  setup() {
    const router = useRouter();

    const suggestions = ref<UserSuggestionModel[]>([
      {
        id: 1,
        color: 'rgb(221, 179, 230)',
        username: 'test',
      },
      {
        id: 2,
        color: 'rgb(221, 179, 230)',
        username: 'test2',
      },
      {
        id: 3,
        color: 'rgb(221, 179, 230)',
        username: 'test23',
      },
    ]);

    async function openExplorePeoplePage() {
      await router.push('/explore/people');
    }

    return {
      suggestions,
      openExplorePeoplePage,
    };
  },
});
</script>
