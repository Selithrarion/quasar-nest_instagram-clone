<template>
  <div class="feed-sidebar-footer column gap-2 text-caption">
    <div class="row gap-2 wrap">
      <BaseButton
        v-for="link in links"
        :key="link.label"
        :label="link.label"
        plain-style
        @click="openExternalPage(link.url)"
      />
    </div>
    <div class="opacity-60">© {{ new Date().getFullYear() }} INSTAGRAM CLONE BY SERGEY MALTSEV</div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import openExternalPage from 'app/utils/openExternalPage';

export default defineComponent({
  name: 'FeedSidebarFooter',

  setup() {
    const links = [
      {
        label: 'About',
        url: 'https://about.instagram.com/',
      },
      {
        label: 'Help',
        url: 'https://help.instagram.com/',
      },
      {
        label: 'Press',
        url: 'https://about.instagram.com/en_US/blog',
      },
      {
        label: 'API',
        url: 'https://developers.facebook.com/docs/instagram',
      },
      {
        label: 'Jobs',
        url: 'https://about.instagram.com/about-us/careers',
      },
    ];

    return {
      openExternalPage,
      links,
    };
  },
});
</script>

<style lang="scss">
.feed-sidebar-footer {
  * {
    color: $blue-grey-5 !important;
  }
}
</style>
