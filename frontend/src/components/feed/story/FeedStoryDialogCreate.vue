<template>
  <BaseDialog title="Create new story" @close="close">
    <template #default>
      <div>
        <VueDrawingCanvas
          ref="VueCanvasDrawing"
          v-model:image="localImage"
          stroke-type="dash"
          :eraser="eraser"
          :line-width="lineWidth"
          :color="color"
          :background-color="backgroundColor"
          :background-image="backgroundImage"
          save-as="jpeg"
        />
      </div>
    </template>
  </BaseDialog>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs, watch } from 'vue';
import VueDrawingCanvas from 'vue-drawing-canvas';

interface VueDrawingCanvasModel {
  redraw: () => void;
}
export default defineComponent({
  name: 'FeedStoryDialogCreate',

  components: {
    VueDrawingCanvas,
  },

  props: {
    image: {
      type: String,
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
    });

    const drawCanvas = ref<VueDrawingCanvasModel | null>(null);
    watch(
      () => props.image,
      () => {
        setImage();
      }
    );
    function setImage() {
      if (!props.image) return;
      state.backgroundImage = props.image;
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
