<template>
  <q-layout view="hHh Lpr lFf">
    <q-header class="bg-white text-blue-grey-7 shadow-3">
      <q-toolbar class="container layout__toolbar" style="min-height: 60px">
        <div class="layout__logo" @click="goToMainPage">
          <CommonLogo style="margin-top: 6px" />
        </div>

        <CommonSearch
          v-model="searchValue"
          v-click-outside="closeSearchMenu"
          class="mobile-hide z-top"
          prepend-icon
          @focus="isSearchMenu = true"
          @search="search"
          @click="getRecentSearch"
        >
          <q-list v-if="isSearchMenu" class="search-menu shadow-4">
            <BaseLoader v-if="loading.active.value" center medium />

            <template v-else>
              <div v-if="isRecentSearchMode" class="q-pa-md text-body1 text-weight-bold">Recent</div>
              <div
                v-if="(!recentSearch.length && isRecentSearchMode) || (!searchData.length && !isRecentSearchMode)"
                class="flex-center absolute-full text-blue-grey-4 text-subtitle2"
              >
                <span v-if="isRecentSearchMode"> No recent searches </span>
                <span v-else>No results found</span>
              </div>

              <BaseItem
                v-for="(item, index) in isRecentSearchMode ? recentSearch : searchData"
                :key="item.id"
                @click="item.username ? openProfile(item) : openTag(item)"
              >
                <q-item-section side>
                  <BaseAvatar
                    size="44px"
                    icon="tag"
                    icon-color="blue-grey-6"
                    :src="item.avatar?.url"
                    :item-name="item.username"
                    :item-color="item.color"
                    :show-icon="!Boolean(item.username)"
                    :border="!Boolean(item.username)"
                  />
                </q-item-section>

                <q-item-section>
                  <q-item-label>
                    {{ item.username || `#${item.name}` }}
                  </q-item-label>
                  <q-item-label caption>
                    {{ item.count === undefined ? item.name : item.count }}
                    <span v-if="item.count !== undefined">
                      {{ t('post.posts', item.count) }}
                    </span>
                  </q-item-label>
                </q-item-section>

                <q-item-section v-if="isRecentSearchMode" side>
                  <BaseButtonCloseIcon
                    tooltip="Remove recent search"
                    @click.stop="removeRecentSearchItem(item.recentSearchID, index)"
                  />
                </q-item-section>
              </BaseItem>
            </template>
          </q-list>
        </CommonSearch>

        <LayoutTabs />
      </q-toolbar>
    </q-header>

    <q-page-container class="bg-app-background--light">
      <router-view class="container" style="padding-top: 38px" />
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import useLoading from 'src/composables/common/useLoading';

import CommonSearch from 'components/common/CommonSearch.vue';
import CommonLogo from 'components/common/CommonLogo.vue';
import LayoutTabs from 'components/layout/LayoutTabs.vue';

import { TagModel } from 'src/models/feed/tag.model';
import { UserModel } from 'src/models/user/user.model';
import userRepository from 'src/repositories/userRepository';
import postRepository from 'src/repositories/postRepository';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'MainLayout',

  components: {
    CommonSearch,
    CommonLogo,
    LayoutTabs,
  },

  setup() {
    const { t } = useI18n();
    const router = useRouter();
    const loading = useLoading();

    function closeSearchMenu() {
      isSearchMenu.value = false;
    }

    const isSearchMenu = ref(false);
    const isTagsSearch = ref(false);
    const searchValue = ref('');
    const searchData = ref<(UserModel | TagModel)[]>([]);
    async function search() {
      if (!searchValue.value) return;
      if (searchValue.value.trim()[0] === '#') {
        isTagsSearch.value = true;
        if (searchValue.value.length === 1) return;
      } else {
        isTagsSearch.value = false;
      }

      try {
        loading.start();
        if (isTagsSearch.value) searchData.value = await postRepository.getTags(searchValue.value.slice(1));
        else searchData.value = await userRepository.getUsers(searchValue.value);
      } finally {
        loading.stop();
      }
    }

    const isRecentSearchMode = computed(() => {
      if (!searchValue.value) return true;
      return isTagsSearch.value && searchValue.value.length === 1;
    });
    const recentSearch = ref<((UserModel & { recentSearchID: number }) | (TagModel & { recentSearchID: number }))[]>(
      []
    );
    async function getRecentSearch() {
      if (recentSearch.value.length) return;

      try {
        loading.start();
        recentSearch.value = await userRepository.getRecentSearch();
      } finally {
        loading.stop();
      }
    }
    async function removeRecentSearchItem(recentSearchID: number, index: number) {
      recentSearch.value.splice(index, 1);
      await userRepository.removeRecentSearch(recentSearchID);
    }

    async function openProfile(user: UserModel) {
      if (!isRecentSearchMode.value) {
        const recentSearchID = await userRepository.addRecentSearch(user.id, 'user');
        if (!recentSearch.value.find((rc) => rc.id === user.id))
          recentSearch.value.unshift({ ...user, recentSearchID });
      }
      isSearchMenu.value = false;
      searchValue.value = '';
      searchData.value = [];
      await router.push(`/profile/${user.username}`);
    }
    async function openTag(tag: TagModel) {
      if (!isRecentSearchMode.value) {
        const recentSearchID = await userRepository.addRecentSearch(tag.id, 'tag');
        if (!recentSearch.value.find((rc) => rc.id === tag.id)) recentSearch.value.unshift({ ...tag, recentSearchID });
      }
      isSearchMenu.value = false;
      searchValue.value = '';
      searchData.value = [];
      await router.push(`/explore/tags/${tag.name}`);
    }
    function goToMainPage() {
      void router.push('/');
    }

    return {
      t,
      loading,

      closeSearchMenu,

      isSearchMenu,
      isTagsSearch,
      searchValue,
      searchData,
      search,

      isRecentSearchMode,
      recentSearch,
      getRecentSearch,
      removeRecentSearchItem,
      openProfile,
      openTag,

      goToMainPage,
    };
  },
});
</script>

<style lang="scss">
.layout__toolbar {
  justify-content: space-between;
  gap: 16px;
  @media screen and (max-width: 1000px) {
    flex-grow: 1;
  }
}
.layout__logo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  flex-grow: 1;
}
.search-menu {
  position: absolute;
  top: 58px;
  left: -75px;
  right: 0;
  bottom: 0;
  height: 300px;
  width: 375px;
  background: white;
  overflow-y: scroll;
}
</style>
