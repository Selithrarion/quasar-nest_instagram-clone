<template>
  <div class="profile-header">
    <BaseAvatar size="150px" :src="profile.avatar?.url" :item-name="profile.username" :item-color="profile.color" />
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
import { UserModel } from 'src/models/user/user.model';

export default defineComponent({
  name: 'ProfileHeader',

  props: {
    profile: {
      type: Object as PropType<UserModel>,
      required: true,
    },
    isOwnProfile: Boolean,
  },

  emits: ['edit-profile'],

  setup() {
    return {};
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
