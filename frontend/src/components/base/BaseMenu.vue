<template>
  <q-menu style="min-width: 150px" :auto-close="autoClose">
    <slot />
  </q-menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseMenu',

  props: {
    autoClose: {
      type: Boolean,
      default: true,
    },
  },

  setup() {
    return {};
  },
});
</script>
