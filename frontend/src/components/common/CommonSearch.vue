<template>
  <div class="relative-position">
    <q-input
      :model-value="modelValue"
      :placeholder="computedPlaceholder"
      :outlined="outlined"
      :debounce="clientSearch ? 0 : 300"
      dense
      v-bind="$attrs"
      @update:model-value="emitSearch"
    >
      <template v-if="prependIcon" #prepend>
        <q-icon name="search" />
      </template>
      <template v-else-if="appendIcon" #prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <slot />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'CommonSearch',

  props: {
    modelValue: {
      type: String,
      required: false,
      default: null,
    },

    clientSearch: Boolean,

    placeholder: {
      type: String,
      required: false,
      default: null,
    },
    outlined: {
      type: Boolean,
      required: false,
      default: true,
    },
    prependIcon: Boolean,
    appendIcon: Boolean,
  },

  emits: ['update:model-value', 'search'],

  setup(props, { emit }) {
    const { t } = useI18n();

    function emitSearch(value: string) {
      const normalizedSearch = value.toLowerCase().trim();
      emit('update:model-value', normalizedSearch);
      emit('search');
    }
    const computedPlaceholder = computed(() => props.placeholder || t('common.search'));

    return { computedPlaceholder, emitSearch };
  },
});
</script>
