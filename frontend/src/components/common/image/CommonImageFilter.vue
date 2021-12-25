<template>
  <div class="common-image-filter row no-wrap gap-2">
    <q-img ref="QImgRef" fit="scale-down" :src="modelValue" :style="styles" @load="setImageData" />
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
import { QImg } from 'quasar';

export default defineComponent({
  name: 'CommonImageFilter',

  components: {
    CommonImageFilterItem,
  },

  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },

  emits: ['update:model-value'],

  setup(props, { emit }) {
    const QImgRef = ref<InstanceType<typeof QImg>>();
    const imageEl = ref<HTMLImageElement>();
    const imageWidth = ref<number>();
    const imageHeight = ref<number>();
    function setImageData() {
      const QImgEl = QImgRef.value?.$el as HTMLElement;
      imageEl.value = QImgEl?.querySelector('.q-img__image') as HTMLImageElement;
      imageWidth.value = imageEl.value.width;
      imageHeight.value = imageEl.value.height;
    }
    function getFilteredImageBlob() {
      if (!imageEl.value || !imageWidth.value || !imageHeight.value) return;

      const canvas = document.createElement('canvas');
      canvas.width = imageWidth.value;
      canvas.height = imageHeight.value;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.filter = styles.value.filter;
      ctx.drawImage(imageEl.value, 0, 0, canvas.width, canvas.height);

      return canvas.toBlob((blob) => {
        console.log(blob);
        emit('update:model-value', blob);
      }, 'image/png');
    }

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
      QImgRef,
      setImageData,
      getFilteredImageBlob,

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
