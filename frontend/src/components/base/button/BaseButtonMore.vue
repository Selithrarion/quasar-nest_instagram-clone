<template>
  <BaseButton icon="more_horiz" :round="round" :flat="flat" v-bind="$attrs">
    <slot />
    <BaseTooltip label="More actions" delay="1000" />
  </BaseButton>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'BaseButtonMore',

  props: {
    round: {
      type: Boolean,
      default: true,
    },
    flat: {
      type: Boolean,
      default: true,
    },
  },
});
</script>
