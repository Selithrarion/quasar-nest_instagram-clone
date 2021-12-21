<template>
  <div class="common-image-cropper">
    <input ref="input" type="file" name="image" accept="image/*" @change="setRawImage" />

    <div class="column gap-6">
      <template v-if="!selectedRaw">
        <div class="flex-center column gap-4">
          <q-icon name="photo_library" size="64px" />
          <div class="text-h6 text-weight-light">Drag photos and videos here</div>
        </div>
        <BaseButton label="Select from computer" color="primary" @click="showFileChooser" />
      </template>

      <template v-else>
        <vue-cropper
          ref="cropper"
          :key="selectedAspectRatio"
          :aspect-ratio="selectedAspectRatio"
          :src="imgSrc"
          :background="false"
        />

        <div class="row gap-4">
          <BaseButton icon="aspect_ratio" unelevated round>
            <BaseMenu>
              <BaseItem
                v-for="ratio in availableAspectRatios"
                :key="ratio.key"
                class="common-image-cropper__ratio-item"
                :class="{ 'common-image-cropper__ratio-item--selected': selectedAspectRatio === ratio.value }"
                :label="ratio.label"
                :append-icon="ratio.icon"
                @click="selectedAspectRatio = ratio.value"
              />
            </BaseMenu>
          </BaseButton>
          <div class="row gap-1">
            <BaseButton icon="zoom_in" unelevated round @click.prevent="zoom(0.2)" />
            <BaseButton icon="zoom_out" unelevated round @click.prevent="zoom(-0.2)" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

export default defineComponent({
  name: 'CommonImageCropper',

  components: {
    VueCropper,
  },

  props: {
    modelValue: {
      type: String,
      default: null,
    },
    selectedRaw: {
      type: String,
      default: null,
    },
  },

  emits: ['update:model-value', 'update:selected-raw'],

  setup(props, { emit }) {
    interface VueCropperModel {
      getCroppedCanvas: () => HTMLCanvasElement;
      getCropBoxData: () => string;
      getData: () => string;
      setData: (v: string) => void;
      replace: (v: string) => void;
      relativeZoom: (v: string) => void;
      move: (x: number, y: number) => void;
      setCropBoxData: (v: string) => void;
    }
    const cropper = ref<VueCropperModel | null>(null);
    const input = ref<HTMLInputElement | null>(null);
    const imgSrc = ref('');
    const data = ref('');

    function cropImage() {
      console.log('CROP IMAGE', cropper.value?.getCroppedCanvas(), cropper.value?.getCroppedCanvas().toDataURL());
      // get image data for post processing, e.g. upload or setting image src
      emit('update:model-value', cropper.value?.getCroppedCanvas().toDataURL());
    }
    // function getCropBoxData() {
    //   data.value = JSON.stringify(cropper.value?.getCropBoxData(), null, 4);
    // }
    // function setCropBoxData() {
    //   if (!data.value) return;
    //   cropper.value?.setCropBoxData(JSON.parse(data.value));
    // }

    // function getData() {
    //   data.value = JSON.stringify(cropper.value?.getData(), null, 4);
    // }
    // function setData() {
    //   if (!data.value) return;
    //   cropper.value?.setData(JSON.parse(data.value));
    // }

    function showFileChooser() {
      input.value?.click();
    }
    function setRawImage(e: Event) {
      const file = (<HTMLInputElement>e.target)?.files?.[0];

      if (!file) return;
      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader !== 'function') alert('Sorry, FileReader API not supported');

      const reader = new FileReader();
      reader.onload = (event: Event) => {
        const target = event.target as EventTarget & { result: string };

        imgSrc.value = target.result;
        emit('update:selected-raw', target.result);

        // rebuild cropper js with the updated source
        cropper.value?.replace(target.result);
      };
      reader.readAsDataURL(file);
    }

    function zoom(percent: string) {
      cropper.value?.relativeZoom(percent);
    }

    const selectedAspectRatio = ref(1);
    const availableAspectRatios = [
      {
        label: 'Original',
        key: 'original',
        value: null,
        icon: 'crop_original',
      },
      {
        label: '1:1',
        key: '1:1',
        value: 1,
        icon: 'crop_square',
      },
      {
        label: '4:5',
        key: '4:5',
        value: 4 / 5,
        icon: 'crop_portrait',
      },
      {
        label: '16:9',
        key: '16:9',
        value: 16 / 9,
        icon: 'crop_landscape',
      },
    ];

    return {
      cropper,
      input,
      imgSrc,
      data,

      cropImage,
      // getCropBoxData,
      // setCropBoxData,
      //
      // getData,
      // setData,
      showFileChooser,
      setRawImage,
      zoom,

      selectedAspectRatio,
      availableAspectRatios,
    };
  },
});
</script>

<style lang="scss" scoped>
.common-image-cropper {
  &__ratio-item {
    opacity: 0.6;
    &:hover {
      opacity: 0.8;
    }
    &:active {
      opacity: 0.85;
    }
    &--selected {
      opacity: 1;
      &:hover {
        opacity: 1;
      }
      &:active {
        opacity: 1;
      }
    }
  }

  input[type='file'] {
    display: none;
  }
}
</style>
