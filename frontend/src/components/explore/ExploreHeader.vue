<template>
  <div class="explore-header">
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
    <div class="explore-header__info">
      <h5 class="row items-center gap-3 no-margin">
        {{ profile.username }}
        <template v-if="isUserProfileMode">
          <BaseButton v-if="isOwnProfile" label="Edit profile" color="primary" flat @click="$emit('edit-profile')" />
          <template v-else>
            <BaseButton
              color="primary"
              :label="profile.isViewerFollowed ? 'Unfollow' : 'Follow'"
              :flat="profile.isViewerFollowed"
              @click="profile.isViewerFollowed ? unfollow() : follow()"
            />
          </template>
        </template>
      </h5>
      <div class="row gap-6 text-body1">
        <div>
          <b>
            {{ profile.postsNumber }}
          </b>
          {{ t('post.posts', profile.postsNumber) }}
        </div>
        <template v-if="isUserProfileMode">
          <div>
            <b>
              {{ profile.followersNumber }}
            </b>
            {{ t('user.followers', profile.followersNumber) }}
          </div>
          <div>
            <b>
              {{ profile.followedNumber }}
            </b>
            {{ t('user.followings', profile.followedNumber) }}
          </div>
        </template>
      </div>
      <div v-if="isUserProfileMode" class="column gap-2">
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
import { computed, defineComponent, PropType } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'src/store';
import useLoading from 'src/composables/common/useLoading';
import openExternalPage from 'app/utils/openExternalPage';

import { UserModel } from 'src/models/user/user.model';
import { PublicFileModel } from 'src/models/common/public-file.model';

export default defineComponent({
  name: 'ExploreHeader',

  props: {
    profile: {
      type: Object as PropType<UserModel>,
      required: true,
    },
    mode: {
      type: String,
      default: 'explore',
      validator: (v: string): boolean => {
        return ['explore', 'userProfile'].includes(v);
      },
    },

    isOwnProfile: Boolean,
  },

  emits: ['edit-profile', 'update-avatar', 'toggle-follow'],

  setup(props, { emit }) {
    const { t } = useI18n();
    const store = useStore();
    const loading = useLoading();

    const isExploreMode = computed(() => props.mode === 'explore');
    const isUserProfileMode = computed(() => props.mode === 'userProfile');

    async function uploadAvatar(file: File) {
      try {
        loading.start();

        const avatar = (await store.dispatch('user/updateAvatar', file)) as PublicFileModel;
        emit('update-avatar', { avatar });
      } finally {
        loading.stop();
      }
    }

    async function follow() {
      try {
        loading.start('follow');
        await store.dispatch('user/follow', props.profile.id);
        emit('toggle-follow');
      } finally {
        loading.stop('follow');
      }
    }
    async function unfollow() {
      try {
        loading.start('unfollow');
        await store.dispatch('user/unfollow', props.profile.id);
        emit('toggle-follow');
      } finally {
        loading.stop('unfollow');
      }
    }

    return {
      t,
      openExternalPage,

      isExploreMode,
      isUserProfileMode,

      uploadAvatar,
      follow,
      unfollow,
    };
  },
});
</script>

<style lang="scss" scoped>
.explore-header {
  display: flex;
  gap: 32px;
  &__info {
    display: flex;
    flex-flow: column;
    gap: 16px;
  }
}
</style>
