<template>
  <BaseButton class="common-icon-messages" icon="send" size="16px" dense />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CommonIconMessages',
});
</script>

<style lang="scss" scoped>
.common-icon-messages {
  transform: rotate(-30deg);
  padding-bottom: 4px;
  padding-left: 8px;
}
</style>
