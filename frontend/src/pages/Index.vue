<template>
  <q-page> </q-page>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onBeforeMount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'src/store';
import { useI18n } from 'vue-i18n';
import useDialog from 'src/composables/common/useDialog';
import useLoading from 'src/composables/common/useLoading';

import CommonPageTitle from 'components/common/CommonPageTitle.vue';
import userRepository from 'src/repositories/userRepository';

export default defineComponent({
  name: 'FeedIndex',

  components: {
    CommonPageTitle,
  },

  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const { t } = useI18n();
    const dialog = useDialog();
    const loading = useLoading();

    const availablePosts = computed(() => store.state.post.posts);

    onBeforeMount(async () => {
      if (!availablePosts.value) await store.dispatch('post/getAll');
    });

    return {
      dialog,
      loading,
      t,

      availablePosts,
    };
  },
});
</script>
