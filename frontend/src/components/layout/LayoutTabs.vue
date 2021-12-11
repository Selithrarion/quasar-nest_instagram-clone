<template>
  <div class="flex-center gap-4">
    <BaseButton icon="home" size="18px" tooltip="Feed" unelevated dense round />

    <CommonIconMessages tooltip="Messages" disabled />

    <BaseButton icon="add_box" size="18px" tooltip="Add post" unelevated dense round />

    <LayoutNotifications />

    <BaseButton size="18px" unelevated dense round>
      <BaseAvatar
        v-if="currentUser"
        size="28px"
        :src="currentUser.avatar && currentUser.avatar.url"
        :item-name="currentUser.username"
        :item-color="currentUser.color"
      />

      <q-menu style="width: 300px">
        <q-list>
          <BaseItem v-close-popup label="Profile" @click="openProfilePage" />
          <BaseItem label="Sign out" :loading="loading.custom.logout" @click="logout" />
        </q-list>
      </q-menu>
    </BaseButton>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import useDialog from 'src/composables/common/useDialog';
import useLoading from 'src/composables/common/useLoading';

import CommonIconMessages from 'components/common/CommonIconMessages.vue';
import LayoutNotifications from 'components/layout/LayoutNotifications.vue';

export default defineComponent({
  name: 'LayoutTabs',

  components: {
    CommonIconMessages,
    LayoutNotifications,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const dialog = useDialog();
    const loading = useLoading({ customNames: ['logout'] });

    const currentUser = computed(() => store.state.user.currentUser);

    async function openProfilePage() {
      const userID = currentUser.value?.id;
      if (userID) await router.push(`/people/${userID}`);
    }
    async function logout() {
      try {
        loading.start('logout');
        await store.dispatch('user/logout');
        await router.push('/auth');
        router.go(0);
      } finally {
        loading.stop('logout');
      }
    }

    return {
      dialog,
      loading,

      currentUser,

      openProfilePage,
      logout,
    };
  },
});
</script>
