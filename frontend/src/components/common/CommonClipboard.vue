<template>
  <span @click="copyToClipboard">
    <slot>
      <q-icon name="content-copy" />
    </slot>
  </span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'CommonClipboard',

  props: {
    text: {
      type: String,
      default: '',
    },
    copyUrl: Boolean,
  },

  setup(props) {
    const q = useQuasar();

    async function copyToClipboard() {
      const text = props.copyUrl ? window.location.href : props.text;
      if (!text) return;

      await navigator.clipboard.writeText(text);
      q.notify({
        message: 'Copied to clipboard',
        type: 'info',
        textColor: 'white',
        timeout: 1000,
      });
    }

    return {
      copyToClipboard,
    };
  },
});
</script>
