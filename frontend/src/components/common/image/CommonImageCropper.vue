<template>
  <div>
    <input ref="input" type="file" name="image" accept="image/*" @change="setImage" />

    <div class="column gap-2">
      <div v-if="!modelValue" class="flex-center column gap-6">
        <q-icon name="photo_library" size="64px" />
        <div class="text-h6 text-weight-light">Drag photos and videos here</div>
      </div>

      <section class="cropper-area">
        <div class="img-cropper">
          <vue-cropper ref="cropper" :aspect-ratio="Number(selectedAspectRatio)" :src="imgSrc" />
        </div>

        <div class="actions">
          <div v-if="modelValue" class="row gap-1">
            <BaseButton icon="aspect_ratio" unelevated round>
              <BaseMenu>
                <BaseItem
                  v-for="ratio in availableAspectRatios"
                  :key="ratio.key"
                  class="ratio-item"
                  :class="{ 'ratio-item--selected': selectedAspectRatio === ratio.key }"
                  :label="ratio.label"
                  :append-icon="ratio.icon"
                  @click="selectedAspectRatio = ratio.key"
                />
              </BaseMenu>
            </BaseButton>
            <BaseButton icon="zoom_in" unelevated round @click.prevent="zoom(0.2)" />
            <BaseButton icon="zoom_out" unelevated round @click.prevent="zoom(-0.2)" />
          </div>

          <!--          <BaseButton @click.prevent="cropImage"> Crop </>BaseButton>-->
          <!--          <BaseButton @click.prevent="getData"> Get Data </>BaseButton>-->
          <!--          <BaseButton @click.prevent="setData"> Set Data </>BaseButton>-->
          <!--          <BaseButton @click.prevent="getCropBoxData"> Get CropBox Data </>BaseButton>-->
          <!--          <BaseButton @click.prevent="setCropBoxData"> Set CropBox Data </>BaseButton>-->
          <BaseButton label="Select from computer" color="primary" @click="showFileChooser" />
        </div>
      </section>
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
  },

  emits: ['update:model-value'],

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
    function getCropBoxData() {
      data.value = JSON.stringify(cropper.value?.getCropBoxData(), null, 4);
    }
    function getData() {
      data.value = JSON.stringify(cropper.value?.getData(), null, 4);
    }

    function setCropBoxData() {
      if (!data.value) return;
      cropper.value?.setCropBoxData(JSON.parse(data.value));
    }
    function setData() {
      if (!data.value) return;
      cropper.value?.setData(JSON.parse(data.value));
    }

    function showFileChooser() {
      input.value?.click();
    }
    function setImage(e: Event) {
      const file = (<HTMLInputElement>e.target)?.files?.[0];
      if (!file) return;

      if (file.type.indexOf('image/') === -1) {
        alert('Please select an image file');
        return;
      }
      if (typeof FileReader === 'function') {
        const reader = new FileReader();
        reader.onload = (event: Event) => {
          const target = event.target as EventTarget & { result: string };
          imgSrc.value = target.result;
          // rebuild cropper js with the updated source
          cropper.value?.replace(target.result);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Sorry, FileReader API not supported');
      }
    }

    function zoom(percent: string) {
      cropper.value?.relativeZoom(percent);
    }

    const selectedAspectRatio = ref('1/1');
    const availableAspectRatios = [
      {
        label: 'Original',
        key: 'original',
        icon: 'crop_original',
      },
      {
        label: '1:1',
        key: '1/1',
        icon: 'crop_square',
      },
      {
        label: '4:5',
        key: '4/5',
        icon: 'crop_portrait',
      },
      {
        label: '16:9',
        key: '16/9',
        icon: 'crop_landscape',
      },
    ];

    return {
      cropper,
      input,
      imgSrc,
      data,

      cropImage,
      getCropBoxData,
      getData,

      setCropBoxData,
      setData,
      showFileChooser,
      setImage,
      zoom,

      selectedAspectRatio,
      availableAspectRatios,
    };
  },
});
</script>

<style lang="scss" scoped>
.ratio-item {
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
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0 5px 0;
}
.header h2 {
  margin: 0;
}
.header a {
  text-decoration: none;
  color: black;
}
.content {
  display: flex;
  justify-content: space-between;
}
.cropper-area {
  width: 614px;
}
.actions {
  margin-top: 1rem;
}
.actions a {
  display: inline-block;
  padding: 5px 15px;
  background: #0062cc;
  color: white;
  text-decoration: none;
  border-radius: 3px;
  margin-right: 1rem;
  margin-bottom: 1rem;
}
textarea {
  width: 100%;
  height: 100px;
}
.preview-area {
  width: 307px;
}
.preview-area p {
  font-size: 1.25rem;
  margin: 0;
  margin-bottom: 1rem;
}
.preview-area p:last-of-type {
  margin-top: 1rem;
}
.preview {
  width: 100%;
  height: calc(372px * (9 / 16));
  overflow: hidden;
}
.crop-placeholder {
  width: 100%;
  height: 200px;
  background: #ccc;
}
.cropped-image img {
  max-width: 100%;
}
</style>
