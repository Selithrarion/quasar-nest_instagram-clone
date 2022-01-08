<template>
  <img
    class="logo"
    src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png"
    :style="styles"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'CommonLogo',

  props: {
    white: Boolean,
  },

  setup(props) {
    const styles = computed(() => {
      return {
        filter: `sepia(1) contrast(0.1) saturate(60) hue-rotate(190deg) brightness(${props.white ? 10 : 0.7})`,
      };
    });

    return {
      styles,
    };
  },
});
</script>
