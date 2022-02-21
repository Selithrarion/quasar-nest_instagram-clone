<template>
  <q-page class="profile q-pa-xl">
    <BaseLoader v-if="loading.active.value" page-margin />
    <template v-else>
      <ExploreHeader
        mode="userProfile"
        :profile="profile"
        :is-own-profile="isOwnProfile"
        @edit-profile="dialog.open('editProfile')"
        @update-avatar="updateProfile"
        @toggle-follow="profile.isViewerFollowed = !profile.isViewerFollowed"
      />

      <ExplorePostList v-if="profile.posts.length">
        <ExplorePost v-for="post in profile.posts" :key="post.id" :post="post" @click="openPost(post)" />
      </ExplorePostList>
      <div v-else class="text-subtitle1 text-blue-grey-4 text-center">There's no posts</div>

      <ProfileDialogEdit
        v-if="isOwnProfile"
        :model-value="dialog.openedName.value === 'editProfile'"
        :profile="profile"
        @updated="updateProfile"
        @close="dialog.close"
      />

      <FeedPostDialogDetail
        :model-value="dialog.openedName.value === 'postDetail'"
        :post="openedPost"
        mode="profile"
        @edit="updatePost"
        @close="dialog.close"
        @toggle-follow="profile.isViewerFollowed = !profile.isViewerFollowed"
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

import ExplorePostList from 'components/explore/ExplorePostList.vue';
import ExplorePost from 'components/explore/ExplorePost.vue';
import ExploreHeader from 'components/explore/ExploreHeader.vue';
import ProfileDialogEdit from 'components/profile/dialog/ProfileDialogEdit.vue';
import FeedPostDialogDetail from 'components/feed/post/dialog/FeedPostDialogDetail.vue';

import userRepository from 'src/repositories/userRepository';
import { UserModel } from 'src/models/user/user.model';
import { PostModel } from 'src/models/feed/post.model';

export default defineComponent({
  name: 'Profile',

  components: {
    ExplorePostList,
    ExplorePost,
    ExploreHeader,
    ProfileDialogEdit,
    FeedPostDialogDetail,
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

    const openedPost = ref<PostModel | null>(null);
    function openPost(post: PostModel) {
      if (!profile.value) return;
      openedPost.value = { ...post, author: profile.value };
      dialog.open('postDetail', { item: post });
    }
    function updateProfile(user: UserModel) {
      profile.value = { ...profile.value, ...user };
    }
    function updatePost(updatedPost: PostModel) {
      if (!profile.value || !profile.value.posts || !openedPost.value) return;

      const postIndex = profile.value.posts.findIndex((p) => p.id === openedPost.value?.id);
      profile.value.posts[postIndex] = { ...profile.value.posts[postIndex], ...updatedPost };
      openedPost.value = { ...openedPost.value, ...updatedPost };
    }

    return {
      dialog,
      loading,

      isOwnProfile,
      profile,

      openedPost,
      openPost,
      updateProfile,
      updatePost,
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
