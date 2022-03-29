<template>
  <BaseDialog :model-value="modelValue" title="Share" @close="close">
    <template #secondHeaderRow>
      <div class="row items-center gap-6 q-pb-lg q-pt-none q-px-lg full-width">
        <div class="text-subtitle1 text-weight-medium">To:</div>
        <div class="row flex-1">
          <q-chip
            v-for="user in selectedUsersArray"
            :key="user.id"
            class="flex-shrink-0"
            color="primary"
            text-color="white"
            :label="user.username"
            removable
            @remove="toggleUserSelection(user.id, user.username)"
          />
          <!--TODO: fix RTL padding-->
          <q-input
            v-model="search"
            class="row full-width flex-1 q-pl-sm"
            style="min-width: 50px"
            placeholder="Search..."
            debounce="300"
            autofocus
            outlined
            dense
            @update:model-value="searchUsers"
          />
        </div>
      </div>
    </template>

    <template #default>
      <div>
        <div class="text-subtitle2 q-pb-sm">Suggested</div>

        <template v-if="loading.active.value || suggestedUsers.length">
          <CommonUser
            v-for="user in loading.active.value ? 3 : suggestedUsers"
            :key="user.id"
            size="48px"
            :user="user"
            :use-skeleton="loading.active.value"
            use-skeleton-username
            @click="toggleUserSelection(user.id, user.username)"
          >
            <template #append>
              <q-icon v-show="selectedUsers[user.id]" size="24px" name="check_circle" color="primary" />
              <q-icon v-show="!selectedUsers[user.id]" size="24px" name="radio_button_unchecked" color="blue-grey-3" />
            </template>
          </CommonUser>
        </template>
        <div v-else class="text-body2 text-blue-grey-5">No account found</div>
      </div>
    </template>

    <template #actionsContent>
      <BaseButton
        class="full-width"
        label="Send"
        color="primary"
        :loading="loading.custom.send"
        :disabled="!selectedUsersArray.length"
        @click="share"
      />
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref, watch } from 'vue';
import useLoading from 'src/composables/common/useLoading';

import CommonUser from 'components/common/CommonUser.vue';

import userRepository from 'src/repositories/userRepository';
import postRepository from 'src/repositories/postRepository';

import { UserModel } from 'src/models/user/user.model';

export default defineComponent({
  name: 'FeedPostDialogShareToUser',

  components: {
    CommonUser,
  },

  props: {
    modelValue: Boolean,
    postId: {
      type: Number,
      default: null,
    },
  },

  emits: ['close'],

  setup(props, { emit }) {
    const loading = useLoading({ customNames: ['send'] });
    watch(
      () => props.modelValue,
      (v) => {
        if (v) void searchUsers();
      }
    );

    const suggestedUsers = ref<UserModel[]>([]);
    const search = ref('');
    async function searchUsers(value = '') {
      try {
        loading.start();
        suggestedUsers.value = await userRepository.getUsers(value);
      } finally {
        loading.stop();
      }
    }

    const selectedUsers = reactive<Record<number, string>>({});
    const selectedUsersArray = computed(() => {
      const arr: { id: number; username: string }[] = [];
      for (const [key, value] of Object.entries(selectedUsers)) {
        arr.push({ id: Number(key), username: value });
      }
      return arr;
    });

    function toggleUserSelection(id: number, username: string) {
      const hasUserSelection = Boolean(selectedUsers[id]);
      if (hasUserSelection) delete selectedUsers[id];
      else selectedUsers[id] = username;
    }

    async function share() {
      try {
        loading.start('send');
        await postRepository.share(props.postId);
        close();
      } finally {
        loading.stop('send');
      }
    }
    function close() {
      // TODO: fix data reset
      Object.assign(selectedUsers, {});
      Object.assign(suggestedUsers, {});
      search.value = '';
      emit('close');
    }

    return {
      loading,

      suggestedUsers,
      search,
      searchUsers,

      selectedUsers,
      selectedUsersArray,
      toggleUserSelection,

      share,
      close,
    };
  },
});
</script>
