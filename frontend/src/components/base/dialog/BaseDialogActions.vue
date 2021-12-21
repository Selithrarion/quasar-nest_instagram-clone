<template>
  <q-card-section class="base-dialog-actions" :class="{ 'base-dialog-actions--dense': dense }">
    <slot />
  </q-card-section>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'BaseDialogActions',

  props: {
    dense: Boolean,
  },
});
</script>

<style lang="scss" scoped>
.base-dialog-actions {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 32px;
  &--dense {
    margin-top: 0;
  }
}
</style>
