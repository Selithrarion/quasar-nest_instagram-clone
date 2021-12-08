<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-white text-blue-grey-7 shadow-3">
      <q-toolbar class="container justify-between gap-4" style="min-height: 60px">
        <div class="flex-center-between cursor-pointer flex-grow-1" @click="goToMainPage">
          <CommonLogo />
        </div>

        <CommonSearch v-model="searchValue" class="mobile-hide" prepend-icon @search="search" />

        <LayoutTabs />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';

import CommonSearch from 'components/common/CommonSearch.vue';
import CommonLogo from 'components/common/CommonLogo.vue';
import LayoutTabs from 'components/layout/LayoutTabs.vue';

export default defineComponent({
  name: 'MainLayout',

  components: {
    CommonSearch,
    CommonLogo,
    LayoutTabs,
  },

  setup() {
    const router = useRouter();

    const searchValue = ref('');
    function search() {
      console.log(searchValue.value);
    }

    async function goToMainPage() {
      await router.push('/');
    }

    return {
      searchValue,
      search,

      goToMainPage,
    };
  },
});
</script>
