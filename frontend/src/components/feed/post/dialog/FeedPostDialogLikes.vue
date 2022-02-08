<template>
  <BaseDialog title="Likes" :model-value="modelValue" :actions="false" @close="$emit('close')">
    <CommonUser
      v-for="(user, userIndex) in availableUsers"
      :key="user.id"
      size="44px"
      :user="user"
      :use-skeleton="loading.active.value"
      use-skeleton-append
      use-skeleton-username
      @click="openUser(user.username)"
    >
      <template #append>
        <BaseButton
          v-if="isNotOwnLike(user.id)"
          color="primary"
          :loading="
            currentUserIdLoading === user.id && user.isViewerFollowed ? loading.custom.follow : loading.custom.unfollow
          "
          :label="user.isViewerFollowed ? 'Unfollow' : 'Follow'"
          :flat="user.isViewerFollowed"
          unelevated
          @click.stop="user.isViewerFollowed ? unfollow(user.id, userIndex) : follow(user.id, userIndex)"
        />
      </template>
    </CommonUser>
  </BaseDialog>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { useStore } from 'src/store';
import { useRouter } from 'vue-router';
import useLoading from 'src/composables/common/useLoading';

import CommonUser from 'components/common/CommonUser.vue';

import { PostModel } from 'src/models/feed/post.model';
import { UserModel } from 'src/models/user/user.model';
import postRepository from 'src/repositories/postRepository';

export default defineComponent({
  name: 'FeedPostDialogLikes',

  components: {
    CommonUser,
  },

  props: {
    modelValue: Boolean,
    post: {
      type: Object as PropType<PostModel>,
      default: null,
    },
  },

  emits: ['close'],

  setup(props) {
    const store = useStore();
    const router = useRouter();
    const loading = useLoading({ customNames: ['follow', 'unfollow'] });

    const currentUser = computed(() => store.state.user.currentUser);

    const availableUsers = ref<UserModel[]>([]);

    watch(
      () => props.modelValue,
      async () => {
        if (!props.modelValue) return;
        loading.start();
        availableUsers.value = await postRepository.getLikes(props.post.id);
        loading.stop();
      }
    );

    function isNotOwnLike(userID: number) {
      return userID !== currentUser.value?.id;
    }

    const currentUserIdLoading = ref(-1);
    async function follow(id: number, index: number) {
      try {
        loading.start('follow');
        currentUserIdLoading.value = id;
        await store.dispatch('user/follow', id);
        availableUsers.value[index].isViewerFollowed = true;
      } finally {
        loading.stop('follow');
      }
    }
    async function unfollow(id: number, index: number) {
      try {
        loading.start('unfollow');
        currentUserIdLoading.value = id;
        await store.dispatch('user/unfollow', id);
        availableUsers.value[index].isViewerFollowed = false;
      } finally {
        loading.stop('unfollow');
      }
    }

    function openUser(username: string) {
      void router.push(`/profile/${username}`);
    }

    return {
      loading,

      availableUsers,

      isNotOwnLike,

      currentUserIdLoading,
      follow,
      unfollow,
      openUser,
    };
  },
});
</script>
