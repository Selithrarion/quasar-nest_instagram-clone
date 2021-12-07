<template>
  <img class="logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CommonLogo',
});
</script>

<style lang="scss" scoped>
.logo {
  filter: sepia(1) contrast(0.1) saturate(60) hue-rotate(190deg) brightness(0.7);
  margin-top: 6px;
}
</style>
