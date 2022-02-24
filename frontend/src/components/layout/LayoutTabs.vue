<template>
  <div class="flex-center gap-1">
    <BaseButton icon="home" size="18px" tooltip="Feed" dense />

    <CommonIconMessages tooltip="Messages" disabled />

    <BaseButton icon="add_box" size="18px" tooltip="Add post" dense @click="dialog.open('createPost')" />

    <BaseButton icon="explore" size="18px" tooltip="Explore" disabled dense />

    <LayoutNotifications />

    <BaseButton size="18px" unelevated dense round>
      <BaseAvatar
        v-if="currentUser"
        size="28px"
        :src="currentUser.avatar && currentUser.avatar.url"
        :item-name="currentUser.username"
        :item-color="currentUser.color"
      />

      <BaseMenu style="width: 300px" :offset="[0, 16]" :auto-close="false">
        <q-list>
          <BaseItem v-close-popup label="Profile" @click="openProfilePage" />
          <BaseItem label="Sign out" :loading="loading.custom.logout" @click="logout" />
        </q-list>
      </BaseMenu>
    </BaseButton>

    <LayoutPostCreate :model-value="dialog.openedName.value === 'createPost'" @close="dialog.close" />
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
import LayoutPostCreate from 'components/layout/LayoutPostCreate.vue';

export default defineComponent({
  name: 'LayoutTabs',

  components: {
    CommonIconMessages,
    LayoutNotifications,
    LayoutPostCreate,
  },

  setup() {
    const store = useStore();
    const router = useRouter();
    const dialog = useDialog();
    const loading = useLoading({ customNames: ['logout'] });

    const currentUser = computed(() => store.state.user.currentUser);

    async function openProfilePage() {
      const username = currentUser.value?.username;
      if (username) await router.push(`/profile/${username}`);
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
