<template>
  <div @click="browseFile">
    <input v-if="active" ref="fileInput" class="hidden" type="file" name="image" :accept="accept" @change="setImage" />
    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'CommonUploader',

  props: {
    active: {
      type: Boolean,
      default: true,
    },

    accept: {
      type: String,
      default: 'image/*',
    },
  },

  emits: ['set-image'],

  setup(props, { emit }) {
    const fileInput = ref<HTMLInputElement | null>(null);
    function browseFile() {
      if (props.active) fileInput.value?.click();
    }

    function setImage($event: Event) {
      const file = (<HTMLInputElement>$event.target)?.files?.[0];
      if (!file) return;
      // if (file.type.indexOf('image/') === -1) {
      //   alert('Please select an image file');
      //   return;
      // }
      if (typeof FileReader !== 'function') alert('Sorry, FileReader API not supported');

      const reader = new FileReader();
      reader.onload = ($readerEvent: Event) => {
        const target = $readerEvent.target as EventTarget & { result: string };

        const image = new Image();
        image.src = target.result;
        image.onload = () => {
          emit('set-image', { image: target.result, width: image.width, height: image.height });
        };
      };
      reader.readAsDataURL(file);
    }

    return {
      fileInput,
      browseFile,

      setImage,
    };
  },
});
</script>
