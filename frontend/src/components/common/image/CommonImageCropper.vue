<template>
  <div
    class="common-image-cropper"
    :class="{ 'common-image-cropper--dragging': isDrag }"
    @drop="handleFileDrop"
    @dragenter="handleDragEnter"
    @dragleave="handleDragLeave"
    @dragover.stop.prevent
  >
    <div class="column gap-6">
      <template v-if="!imageRaw">
        <div class="flex-center column gap-4">
          <q-icon name="photo_library" size="64px" />
          <div class="text-h6 text-weight-light">Drag photos and videos here</div>
        </div>
        <CommonUploader @set-image="setRawImage">
          <BaseButton label="Select from computer" color="primary" />
        </CommonUploader>
      </template>

      <template v-else>
        <VueCropper
          ref="cropper"
          :key="selectedAspectRatio"
          class="common-image-cropper__cropper"
          :aspect-ratio="selectedAspectRatio"
          :src="imgSrc"
          :background="false"
          @ready="setCroppedImageData"
        />

        <div class="row gap-4">
          <BaseButton icon="aspect_ratio">
            <BaseMenu>
              <BaseItem
                v-for="ratio in availableAspectRatios"
                :key="ratio.key"
                class="common-image-cropper__ratio-item"
                :class="{ 'common-image-cropper__ratio-item--selected': selectedAspectRatio === ratio.value }"
                :label="ratio.label"
                :append-icon="ratio.icon"
                @click="setSelectedAspectRatio(ratio.value)"
              />
            </BaseMenu>
          </BaseButton>
          <div class="row gap-1">
            <BaseButton icon="zoom_in" @click.prevent="zoom(0.2)" />
            <BaseButton icon="zoom_out" @click.prevent="zoom(-0.2)" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, onBeforeUnmount, ref } from 'vue';
import VueCropper from 'vue-cropperjs';
import 'cropperjs/dist/cropper.css';

import CommonUploader from 'components/common/CommonUploader.vue';

interface VueCropperModel {
  getCroppedCanvas: (options?: GetCroppedCanvasOptions) => HTMLCanvasElement;
  getCropBoxData: () => string;
  setCropBoxData: (v: string) => void;
  getData: () => string;
  setData: (v: string) => void;
  replace: (v: string) => void;
  relativeZoom: (v: string) => void;
  move: (x: number, y: number) => void;
}
interface GetCroppedCanvasOptions {
  width?: number;
  height?: number;
  minWidth?: number;
  minHeight?: number;
  maxWidth?: number;
  maxHeight?: number;
  fillColor?: string;
  imageSmoothingEnabled?: boolean;
  imageSmoothingQuality?: string;
}

export default defineComponent({
  name: 'CommonImageCropper',

  components: {
    VueCropper,
    CommonUploader,
  },

  props: {
    modelValue: {
      type: [String, Blob],
      default: null,
    },
    imageRaw: {
      type: String,
      default: null,
    },
    imageCropData: {
      type: Object,
      default: null,
    },
    aspectRatio: {
      type: Number,
      default: 1,
    },
  },

  emits: ['update:model-value', 'update:image-raw', 'update:image-crop-data', 'update:aspect-ratio'],

  setup(props, { emit }) {
    const cropper = ref<VueCropperModel | null>(null);
    const imgSrc = ref(props.imageRaw);
    const data = ref('');

    onMounted(() => {
      addDragListeners();
    });
    onBeforeUnmount(() => {
      removeDragListeners();
    });

    function getCroppedImageBlob() {
      cropper.value?.getCroppedCanvas({ fillColor: '#fff' }).toBlob((blob) => {
        emit('update:model-value', blob);
      }, 'image/png');
    }
    function getCroppedImageData() {
      const cropperData = cropper.value?.getData();
      emit('update:image-crop-data', cropperData);
    }
    function setCroppedImageData() {
      if (!props.imageCropData) return;
      cropper.value?.setData(JSON.stringify(props.imageCropData));
    }

    function setRawImage({ image = '' }) {
      imgSrc.value = image;
      emit('update:image-raw', image);
      // rebuild cropper js with the updated source
      cropper.value?.replace(image);
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
    function setSelectedAspectRatio(value: number) {
      selectedAspectRatio.value = value;
      emit('update:aspect-ratio', value);
    }

    const isDrag = ref(false);
    const isDragAllowed = ref(true);
    function handleFileDrop($event: DragEvent) {
      $event.stopPropagation();
      $event.preventDefault();

      if (!isDragAllowed.value) enableFilesDrag();
      isDrag.value = false;

      const files = $event.dataTransfer?.files;
      if (!files || !files.length) return;

      console.log(files);
    }
    function handleDragEnter() {
      if (isDragAllowed.value) isDrag.value = true;
    }
    function handleDragLeave($event: DragEvent) {
      const isTrueLeave = !$event.pageY && !$event.pageY;
      if (isTrueLeave) isDrag.value = false;
    }
    function handleDragOver($event: DragEvent) {
      $event.stopPropagation();
      $event.preventDefault();
    }

    function enableFilesDrag() {
      isDragAllowed.value = true;
    }
    function disableFilesDrag() {
      isDrag.value = false;
      isDragAllowed.value = false;
    }
    function addDragListeners() {
      window.addEventListener('dragenter', handleDragEnter);
      window.addEventListener('dragleave', handleDragLeave);
      window.addEventListener('dragover', handleDragOver);

      window.addEventListener('drop', handleFileDrop);

      document.addEventListener('mousedown', disableFilesDrag);
      document.addEventListener('mouseup', enableFilesDrag);
    }
    function removeDragListeners() {
      window.removeEventListener('dragenter', handleDragEnter);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('dragover', handleDragOver);

      window.removeEventListener('drop', handleFileDrop);

      document.removeEventListener('mousedown', disableFilesDrag);
      document.removeEventListener('mouseup', enableFilesDrag);
    }

    return {
      cropper,
      imgSrc,
      data,

      getCroppedImageBlob,
      getCroppedImageData,
      setCroppedImageData,

      setRawImage,
      zoom,

      selectedAspectRatio,
      availableAspectRatios,
      setSelectedAspectRatio,

      isDrag,
    };
  },
});
</script>

<style lang="scss" scoped>
.common-image-cropper {
  &--dragging::after {
    content: 'Drop files';
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    z-index: 10;

    display: flex;
    justify-content: center;
    align-items: center;

    color: white;
    font-size: 24px;
    background-color: rgba(114, 202, 198, 0.35);
  }

  &__cropper {
    max-height: 60vh;
  }

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

  ::v-deep .cropper-container {
    .cropper-view-box {
      outline-color: $primary;
    }
    .cropper-line {
      background-color: $primary;
    }
    .cropper-point {
      background-color: $primary;
    }
  }
}
</style>
