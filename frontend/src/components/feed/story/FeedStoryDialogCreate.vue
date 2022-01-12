<template>
  <BaseDialog title="Create new story" @close="close">
    <template #default>
      <div class="flex-center">
        <VueDrawingCanvas
          ref="drawCanvas"
          v-model:image="localImage"
          class="shadow-1"
          stroke-type="dash"
          :eraser="eraser"
          :line-width="lineWidth"
          :color="color"
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
import { defineComponent, PropType, reactive, ref, toRefs, watch } from 'vue';
import VueDrawingCanvas from 'vue-drawing-canvas';

interface VueDrawingCanvasModel {
  redraw: () => void;
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
    const state = reactive({
      x: 0,
      y: 0,
      localImage: '',
      eraser: false,
      lineWidth: 5,
      color: '#000000',
      backgroundColor: '#FFFFFF',
      backgroundImage: '',
      backgroundImageWidth: 550,
      backgroundImageHeight: 400,
    });

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

    function close() {
      emit('close');
    }

    return {
      ...toRefs(state),
      drawCanvas,
      close,
    };
  },
});
</script>
