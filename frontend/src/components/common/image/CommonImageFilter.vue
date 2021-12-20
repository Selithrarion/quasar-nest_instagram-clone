<template>
  <div class="common-image-filter row no-wrap gap-2">
    <q-img fit="scale-down" :src="image" :style="styles" />
    <div class="common-image-filter__items column gap-1 w-full q-pl-md">
      <CommonImageFilterItem v-model="filter.brightness" label="Brightness" :max="2" />
      <CommonImageFilterItem v-model="filter.contrast" label="Contrast" :max="2" />
      <CommonImageFilterItem v-model="filter.saturate" label="Saturation" :max="2" />
      <CommonImageFilterItem v-model="filter.grayscale" label="Grayscale" />
      <CommonImageFilterItem v-model="filter.sepia" label="Sepia" />
      <CommonImageFilterItem v-model="filter.invert" label="Invert" />
      <CommonImageFilterItem v-model="filter.hueRotate" label="Hue rotate" :max="360" :step="1" />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import CommonImageFilterItem from 'components/common/image/CommonImageFilterItem.vue';

export default defineComponent({
  name: 'CommonImageFilter',

  components: {
    CommonImageFilterItem,
  },

  props: {
    image: {
      type: String,
      required: true,
    },
  },

  setup() {
    const filter = ref<Record<string, number>>({
      brightness: 1,
      contrast: 1,
      saturate: 1,
      grayscale: 0,
      sepia: 0,
      invert: 0,
      blur: 0,
      hueRotate: 0,
    });
    const suffixes = ref<Record<string, string>>({
      hueRotate: 'deg',
      blur: 'px',
    });

    const styles = computed(() => {
      const toDash = (v: string) => v.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      return {
        filter: Object.entries(filter.value)
          .filter((item) => typeof item[1] !== 'object')
          .map((item) => `${toDash(item[0])}(${item[1]}${suffixes.value[item[0]] || ''})`)
          .join(' '),
      };
    });

    return {
      filter,
      styles,
    };
  },
});
</script>

<style lang="scss" scoped>
.common-image-filter {
  .q-img {
    width: 50%;
  }
  &__items {
    width: 50%;
  }
}
</style>
