<template>
  <q-page class="column gap-2" padding>
    <div class="text-body1 text-blue-grey-6">Suggested</div>

    <template v-if="suggestions">
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
    </template>

    <BaseLoader v-if="loading.active.value || !suggestions" :page-margin="!suggestions" />
  </q-page>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import useLoading from 'src/composables/common/useLoading';

import CommonUser from 'components/common/CommonUser.vue';

import userRepository from 'src/repositories/userRepository';
import { UserSuggestionModel } from 'src/models/user/user.model';
import { PaginationApiPayload } from 'src/models/common/pagination.model';

export default defineComponent({
  name: 'ExplorePeople',

  components: {
    CommonUser,
  },

  setup() {
    const router = useRouter();
    const loading = useLoading({ default: true });

    const suggestions = ref<UserSuggestionModel[] | null>(null);
    const pagination = ref<PaginationApiPayload>({
      page: 1,
      limit: 30,
    });
    onBeforeMount(async () => {
      suggestions.value = await userRepository.getSuggestions(pagination.value);
      loading.stop();
    });

    function openProfile(username: string) {
      void router.push(`/profile/${username}`);
    }

    return {
      loading,

      suggestions,
      openProfile,
    };
  },
});
</script>
