<template>
  <BaseDialog title="Likes" :model-value="modelValue" :actions="false" @close="$emit('close')">
    <CommonUser
      v-for="user in formattedUsers"
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
          color="primary"
          :loading="
            currentUsernameLoading === user.username && user.isViewerFollowed
              ? loading.custom.follow
              : loading.custom.unfollow
          "
          :label="user.isViewerFollowed ? 'Unfollow' : 'Follow'"
          :flat="user.isViewerFollowed"
          unelevated
          @click.stop="user.isViewerFollowed ? unfollow : follow"
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
    const formattedUsers = computed(() =>
      availableUsers.value.map((u) => {
        return {
          ...u,
          isViewerFollowed: currentUser.value ? u.followersIDs.includes(currentUser.value.id) : false,
        };
      })
    );

    watch(
      () => props.modelValue,
      async () => {
        if (!props.modelValue) return;
        loading.start();
        availableUsers.value = await postRepository.getLikes(props.post.id);
        loading.stop();
      }
    );

    const currentUsernameLoading = ref('');
    function follow(username: string) {
      try {
        loading.start('follow');
        currentUsernameLoading.value = username;
        console.log('follow');
      } finally {
        loading.stop('follow');
      }
    }
    function unfollow(username: string) {
      try {
        loading.start('unfollow');
        currentUsernameLoading.value = username;
        console.log('unfollow');
      } finally {
        loading.stop('unfollow');
      }
    }

    function openUser(username: string) {
      void router.push(`/${username}`);
    }

    return {
      loading,

      availableUsers,
      formattedUsers,

      currentUsernameLoading,
      follow,
      unfollow,
      openUser,
    };
  },
});
</script>
