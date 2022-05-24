<template>
  <BaseButton v-close-popup icon="close" :tooltip="tooltip" :flat="flat" :round="round" :dense="dense" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseButtonCloseIcon',

  props: {
    round: {
      type: Boolean,
      default: true,
    },
    flat: {
      type: Boolean,
      default: true,
    },
    dense: {
      type: Boolean,
      default: true,
    },
    tooltip: {
      type: String,
      default: 'Close',
    },
  },
});
</script>
