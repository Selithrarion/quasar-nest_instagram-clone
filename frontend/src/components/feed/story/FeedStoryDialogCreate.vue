<template>
  <BaseDialog title="Create new story" :confirm-loading="loading.active.value" @confirm="createStory" @close="close">
    <template #default>
      <div class="flex-center relative-position" style="min-height: 330px">
        <div class="absolute-top-left row gap-1">
          <BaseButton tooltip="Undo (Ctrl + Z)" icon="undo" @click="undo" />
          <BaseButton tooltip="Redo (Ctrl + Y)" icon="redo" @click="redo" />
        </div>

        <div class="absolute-top-right column gap-4">
          <div class="row gap-1">
            <BaseButton
              :class="{ 'brush--selected': !eraser }"
              tooltip="Select brush (1)"
              icon="brush"
              @click="eraser = false"
            />
            <BaseButton
              :class="{ 'brush--selected': eraser }"
              tooltip="Select eraser (2)"
              icon="remove"
              @click="eraser = true"
            />
          </div>
          <div class="column gap-1 items-center">
            <button
              v-for="color in availableColors"
              :key="color"
              type="button"
              class="color"
              :class="{ 'color--selected': drawColor === color && !eraser }"
              :style="{ backgroundColor: color }"
              @click="selectColor(color)"
            />
          </div>
        </div>
        <VueDrawingCanvas
          ref="drawCanvas"
          v-model:image="localImage"
          class="shadow-1"
          stroke-type="dash"
          :eraser="eraser"
          :line-width="lineWidth"
          :color="drawColor"
          :background-color="backgroundColor"
          :background-image="backgroundImage"
          :width="backgroundImageWidth"
          :height="backgroundImageHeight"
          save-as="jpeg"
          canvas-id="drawCanvas"
        />
      </div>
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, PropType, reactive, ref, toRefs, watch } from 'vue';
import VueDrawingCanvas from 'vue-drawing-canvas';
import useLoading from 'src/composables/common/useLoading';
import { useStore } from 'src/store';
import storyRepository from 'src/repositories/storyRepository';

interface VueDrawingCanvasModel {
  redraw: () => void;
  undo: () => void;
  redo: () => void;
}
// refactor
interface ImageDataModel {
  image: string;
  width: number;
  height: number;
}

export default defineComponent({
  name: 'FeedStoryDialogCreate',

  components: {
    VueDrawingCanvas,
  },

  props: {
    imageData: {
      type: Object as PropType<ImageDataModel>,
      default: null,
    },
  },

  emits: ['close'],

  setup(props, { emit }) {
    const store = useStore();
    const loading = useLoading();

    onMounted(() => {
      document.addEventListener('keydown', handleKeydown);
    });
    onBeforeUnmount(() => {
      document.removeEventListener('keydown', handleKeydown);
    });

    const state = reactive({
      x: 0,
      y: 0,
      localImage: '',
      eraser: false,
      lineWidth: 5,
      drawColor: '#000000',
      backgroundColor: '#ffffff',
      backgroundImage: '',
      backgroundImageWidth: 550,
      backgroundImageHeight: 400,
    });

    const availableColors = ['#fdcb5c', '#fd8d32', '#d10869', '#a307ba', '#0095f6', '#58c322', '#000000', '#ffffff'];
    function selectColor(color: string) {
      state.drawColor = color;
      state.eraser = false;
    }

    const drawCanvas = ref<VueDrawingCanvasModel | null>(null);
    watch(
      () => props.imageData,
      () => {
        setImage();
      }
    );
    // TODO: fix if very large image
    function setImage() {
      if (!props.imageData.image) return;

      state.backgroundImageWidth = props.imageData.width;
      state.backgroundImageHeight = props.imageData.height;
      state.backgroundImage = props.imageData.image;
      drawCanvas.value?.redraw();
    }
    function handleKeydown(event: KeyboardEvent) {
      if (event.ctrlKey && event.code === 'KeyZ') {
        undo();
      } else if (event.ctrlKey && event.code === 'KeyY') {
        redo();
      } else if (!event.ctrlKey && event.key === '1') {
        state.eraser = false;
      } else if (!event.ctrlKey && event.key === '2') {
        state.eraser = true;
      }
    }
    function undo() {
      drawCanvas.value?.undo();
    }
    function redo() {
      drawCanvas.value?.redo();
    }

    async function createStory() {
      try {
        loading.start();

        const formData = new FormData();
        formData.append('image', state.localImage);
        await storyRepository.create(formData);

        close();
        await store.dispatch('post/getAll');
      } finally {
        loading.stop();
      }
    }
    function close() {
      emit('close');
    }

    return {
      loading,
      ...toRefs(state),

      availableColors,
      selectColor,

      drawCanvas,
      undo,
      redo,

      createStory,
      close,
    };
  },
});
</script>

<style lang="scss" scoped>
.brush--selected {
  border: 1px solid $blue-grey-3;
  background: $blue-grey-1;
}
.color {
  width: 32px;
  height: 32px;
  border: 1px solid $blue-grey-3;
  border-radius: 50%;
  transition: transform 100ms ease-out, filter 100ms ease-out, border 100ms ease-out;
  cursor: pointer;
  &:not(&--selected) {
    &:hover {
      filter: brightness(1.1);
      border: 1px solid $blue-grey-4;
    }
    &:active {
      filter: brightness(1.15);
      border: 1px solid $blue-grey-4;
      transform: scale(0.9);
    }
  }
  &--selected {
    border: 1px solid $blue-grey-6;
    transform: scale(1.15);
    cursor: default;
  }
}
</style>
