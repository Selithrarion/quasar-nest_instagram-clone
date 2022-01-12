<template>
  <BaseButton icon="mood" dense @click.stop="openPicker" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { EmojiButton } from '@joeattardi/emoji-button';

export default defineComponent({
  name: 'CommonEmojiPicker',

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },

  emits: ['update:model-value'],

  setup(props, { emit }) {
    const search = ref('');
    function appendEmoji(emoji: string) {
      emit('update:model-value', props.modelValue + emoji);
    }

    const picker = ref<EmojiButton | null>(null);
    function openPicker({ target }: Event) {
      picker.value?.togglePicker(target as HTMLElement);
    }
    onMounted(() => {
      picker.value = new EmojiButton();
      picker.value.on('emoji', (selection: { emoji: string }) => {
        appendEmoji(selection.emoji);
      });
    });

    return {
      search,
      picker,
      openPicker,
      appendEmoji,
    };
  },
});
</script>
