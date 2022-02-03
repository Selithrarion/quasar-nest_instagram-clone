<template>
  <q-page class="profile q-pa-xl">
    <BaseLoader v-if="loading.active.value" page-margin />
    <template v-else>
      <ProfileHeader :profile="profile" :is-own-profile="isOwnProfile" @edit-profile="dialog.open('editProfile')"  @update-avatar="updateProfile"/>

      <ProfilePostList>
        <ProfilePost
          v-for="post in profile.posts"
          :key="post.id"
          :post="post"
          @click="dialog.open('postDetail', { item: post })"
        />
      </ProfilePostList>

      <ProfileDialogEdit
        v-if="isOwnProfile"
        :model-value="dialog.openedName.value === 'editProfile'"
        :profile="profile"
        @updated="updateProfile"
        @close="dialog.close"
      />

      <FeedPostDialogDetail
        :model-value="dialog.openedName.value === 'postDetail'"
        :post="{ ...dialog.openedItem.value, author: profile }"
        mode="profile"
        @open-likes="dialog.open('postLikes', { item: dialog.openedItem.value })"
        @edit="dialog.open('editPost', { item: dialog.openedItem.value })"
        @delete="dialog.open('deletePost', { item: dialog.openedItem.value })"
        @share="dialog.open('share', { item: dialog.openedItem.value })"
        @close="dialog.close"
      />

      <BaseDialog
        type="delete"
        title="Delete post"
        :model-value="dialog.openedName.value === 'deletePost'"
        :confirm-loading="dialog.loading.value"
        @close="dialog.close"
        @confirm="deletePost(dialog.openedItem.value.id)"
      >
        Are you sure you want to delete this post?
      </BaseDialog>
      <FeedPostDialogEdit
        :model-value="dialog.openedName.value === 'editPost'"
        :post="dialog.openedItem.value"
        @close="dialog.close"
      />

      <FeedPostDialogLikes
        :model-value="dialog.openedName.value === 'postLikes'"
        :post="dialog.openedItem.value"
        @close="dialog.close"
      />

      <FeedPostDialogShare
        :model-value="dialog.openedName.value === 'share'"
        :post="dialog.openedItem.value"
        @close="dialog.close"
      />
      <FeedPostDialogShareToUser
        :model-value="dialog.openedName.value === 'shareToUser'"
        :post-id="dialog.openedItem.value?.id"
        @close="dialog.close"
      />
    </template>
  </q-page>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref, watch } from 'vue';
import { useStore } from 'src/store';
import { useRoute } from 'vue-router';
import useDialog from 'src/composables/common/useDialog';
import useLoading from 'src/composables/common/useLoading';
import openExternalPage from 'app/utils/openExternalPage';

import ProfilePostList from 'components/profile/ProfilePostList.vue';
import ProfilePost from 'components/profile/ProfilePost.vue';
import ProfileHeader from 'components/profile/ProfileHeader.vue';
import ProfileDialogEdit from 'components/profile/dialog/ProfileDialogEdit.vue';
import FeedPostDialogDetail from 'components/feed/post/dialog/FeedPostDialogDetail.vue';
import FeedPostDialogLikes from 'components/feed/post/dialog/FeedPostDialogLikes.vue';
import FeedPostDialogEdit from 'components/feed/post/dialog/FeedPostDialogEdit.vue';
import FeedPostDialogShare from 'components/feed/post/dialog/FeedPostDialogShare.vue';
import FeedPostDialogShareToUser from 'components/feed/post/dialog/FeedPostDialogShareToUser.vue';

import userRepository from 'src/repositories/userRepository';
import { UserModel } from 'src/models/user/user.model';

export default defineComponent({
  name: 'Profile',

  components: {
    ProfilePostList,
    ProfilePost,
    ProfileHeader,
    ProfileDialogEdit,
    FeedPostDialogDetail,
    FeedPostDialogLikes,
    FeedPostDialogEdit,
    FeedPostDialogShare,
    FeedPostDialogShareToUser,
  },

  setup() {
    const store = useStore();
    const route = useRoute();
    const dialog = useDialog();
    const loading = useLoading({ default: true });

    const isOwnProfile = computed(() => profile.value?.id === store.state.user.currentUser?.id);
    const profile = ref<UserModel | null>(null);
    onBeforeMount(async () => {
      const { profileUsername } = route.params;
      profile.value = await userRepository.getProfileByUsername(String(profileUsername));
      loading.stop();
    });
    watch(
      () => route.params.profileUsername,
      async () => {
        loading.start();
        profile.value = await userRepository.getProfileByUsername(String(route.params.profileUsername));
        loading.stop();
      }
    );
    function updateProfile(user: UserModel) {
      profile.value = { ...profile.value, ...user };
    }

    return {
      dialog,
      loading,
      openExternalPage,

      isOwnProfile,
      profile,
      updateProfile,
    };
  },
});
</script>

<style lang="scss" scoped>
.profile {
  display: flex;
  flex-flow: column;
  gap: 64px;
}
</style>
