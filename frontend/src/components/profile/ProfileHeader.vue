<template>
  <div class="profile-header">
    <BaseAvatar
      size="150px"
      :src="profile.avatar?.url"
      :item-name="profile.username"
      :item-color="profile.color"
      :clickable="isOwnProfile"
      :upload-avatar="isOwnProfile"
      :tooltip="isOwnProfile ? 'Upload new avatar' : null"
      @select-avatar="uploadAvatar"
    />
    <div class="profile-header__info">
      <h5 class="row items-center gap-3 no-margin">
        {{ profile.username }}
        <BaseButton v-if="isOwnProfile" label="Edit profile" color="primary" flat @click="$emit('edit-profile')" />
      </h5>
      <div class="row gap-6 text-body1">
        <div>
          <b>
            {{ profile.postsNumber }}
          </b>
          posts
        </div>
        <div>
          <b>
            {{ profile.followersNumber }}
          </b>
          followers
        </div>
        <div>
          <b>
            {{ profile.followedNumber }}
          </b>
          following
        </div>
      </div>
      <div class="column gap-2">
        <div class="text-body1 text-weight-bold">
          {{ profile.name }}
        </div>
        <div v-if="profile.description">
          {{ profile.description }}
        </div>
        <div>
          <BaseButton v-if="profile.website" plain-style @click="openExternalPage(profile.website)">
            {{ profile.website }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { useQuasar } from 'quasar';
import { useStore } from 'src/store';
import useLoading from 'src/composables/common/useLoading';

import { UserModel } from 'src/models/user/user.model';
import { PublicFileModel } from 'src/models/common/public-file.model';

export default defineComponent({
  name: 'ProfileHeader',

  props: {
    profile: {
      type: Object as PropType<UserModel>,
      required: true,
    },
    isOwnProfile: Boolean,
  },

  emits: ['edit-profile', 'update-avatar'],

  setup(_, { emit }) {
    const q = useQuasar();
    const store = useStore();
    const loading = useLoading();

    async function uploadAvatar(file: File) {
      try {
        loading.start();

        const avatar = (await store.dispatch('user/updateAvatar', file)) as PublicFileModel;
        emit('update-avatar', { avatar });

        q.notify({
          type: 'positive',
          message: 'Avatar updated',
        });
      } finally {
        loading.stop();
      }
    }

    return {
      uploadAvatar,
    };
  },
});
</script>

<style lang="scss" scoped>
.profile-header {
  display: flex;
  gap: 32px;
  &__info {
    display: flex;
    flex-flow: column;
    gap: 16px;
  }
}
</style>
