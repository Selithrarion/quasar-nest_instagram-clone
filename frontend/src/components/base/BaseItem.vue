<template>
  <q-item
    v-ripple="clickable"
    class="base-item"
    :class="{ 'text-red-6 text-weight-medium': danger }"
    :style="{ minWidth }"
    :clickable="clickable"
    v-bind="$attrs"
  >
    <BaseLoader v-if="loading" class="flex-center" gray-color medium />

    <slot v-else>
      <q-item-section>
        <q-item-label>
          {{ label }}
        </q-item-label>
      </q-item-section>
    </slot>
  </q-item>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseItem',

  props: {
    label: {
      type: [Number, String],
      required: false,
      default: null,
    },
    clickable: {
      type: Boolean,
      required: false,
      default: true,
    },
    danger: Boolean,

    minWidth: {
      type: [Number, String],
      default: null,
    },

    loading: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.base-item {
  display: flex;
  align-items: center;
}
</style>
