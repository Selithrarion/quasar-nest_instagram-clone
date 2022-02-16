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
      required: false,
      default: true,
    },
    flat: {
      type: Boolean,
      required: false,
      default: true,
    },
    dense: {
      type: Boolean,
      required: false,
      default: true,
    },
    tooltip: {
      type: String,
      required: false,
      default: 'Close',
    },
  },
});
</script>
