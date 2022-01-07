<template>
  <BaseDialog title="Share" @close="$emit('close')">
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
          <input
            class="row full-width flex-1 q-pl-sm"
            style="min-width: 50px; min-height: 36px"
            placeholder="Search..."
            autofocus
          />
        </div>
      </div>
    </template>

    <template #default>
      <div>
        <div class="text-subtitle2 q-pb-sm">Suggested</div>
        <CommonUser
          v-for="user in suggestedUsers"
          :key="user"
          :avatar="user?.avatar?.url"
          :color="user.color"
          :username="user.username"
          :name="user.name"
          @click="toggleUserSelection(user.id, user.username)"
        >
          <template #append>
            <q-icon v-show="selectedUsers[user.id]" size="24px" name="check_circle" color="primary" />
            <q-icon v-show="!selectedUsers[user.id]" size="24px" name="radio_button_unchecked" color="blue-grey-3" />
          </template>
        </CommonUser>
      </div>
    </template>

    <template #actionsContent>
      <BaseButton class="full-width" label="Send" color="primary" :disabled="!selectedUsersArray.length" />
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import { computed, defineComponent, reactive, ref } from 'vue';
import CommonUser from 'components/common/CommonUser.vue';

export default defineComponent({
  name: 'FeedPostDialogShareToUser',

  components: {
    CommonUser,
  },

  emits: ['close'],

  setup() {
    const suggestedUsers = [
      { id: 1, username: '123', color: 'hsl(290, 50%, 80%)', name: '124124' },
      { id: 2, username: '1234', color: 'hsl(290, 50%, 80%)', name: '124124' },
      { id: 3, username: '1235', color: 'hsl(290, 50%, 80%)', name: '124124' },
      { id: 4, username: '1263', color: 'hsl(290, 50%, 80%)', name: '124124' },
      { id: 5, username: '1273', color: 'hsl(290, 50%, 80%)', name: '124124' },
      { id: 6, username: '1283', color: 'hsl(290, 50%, 80%)', name: '124124' },
      { id: 7, username: '1283', color: 'hsl(290, 50%, 80%)', name: '124124' },
      { id: 78, username: '1283', color: 'hsl(290, 50%, 80%)', name: '124124' },
    ];
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

    return {
      suggestedUsers,

      selectedUsers,
      selectedUsersArray,
      toggleUserSelection,
    };
  },
});
</script>
