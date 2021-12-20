<template>
  <div class="common-image-filter-item column gap-1">
    <div class="flex-center-between">
      <div>
        {{ label }}
      </div>
      <BaseButton
        class="common-image-filter-item__reset"
        label="Reset"
        dense
        flat
        @click="$emit('update:model-value', defaultValue)"
      />
    </div>

    <q-slider
      :model-value="modelValue"
      :min="0"
      :max="max"
      :step="step"
      color="black"
      dense
      @update:model-value="$emit('update:model-value', $event)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CommonImageFilterItem',

  props: {
    modelValue: {
      type: [Number, String],
      default: 0,
    },

    label: {
      type: String,
      default: '',
    },

    step: {
      type: [Number, String],
      default: 0.01,
    },
    max: {
      type: [Number, String],
      default: 1,
    },
  },

  emits: ['update:model-value', 'reset'],

  setup(props) {
    const defaultValue = ref(props.modelValue);

    return {
      defaultValue,
    };
  },
});
</script>

<style lang="scss">
.common-image-filter-item {
  &:hover {
    .common-image-filter-item__reset {
      opacity: 1;
    }
  }

  &__reset {
    opacity: 0;
  }
}
</style>
