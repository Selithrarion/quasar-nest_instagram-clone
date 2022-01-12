<template>
  <BaseButton
    class="common-navigation-button"
    size="10px"
    :icon="type === 'previous' ? 'navigate_before' : 'navigate_next'"
    :tooltip="type === 'previous' ? 'Show previous' : 'Show next'"
    :unelevated="false"
  />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CommonNavigationButton',

  props: {
    type: {
      type: String,
      default: 'previous',
      validator: (v: string) => {
        return ['previous', 'next'].includes(v);
      },
    },
  },
});
</script>

<style lang="scss" scoped>
.common-navigation-button {
}
</style>
