<template>
  <q-input
    class="base-input"
    :class="{ 'base-input--hashtags': useHashtags }"
    :model-value="localModelValue"
    :filled="filled"
    :autogrow="autogrow"
    v-bind="$attrs"
    @keydown="handleKeydown"
    @update:model-value="handleInput"
  >
    <template #prepend>
      <div class="row wrap q-pt-xs">
        <q-chip
          v-for="(tag, index) in allLocalTags"
          :key="tag"
          class="flex-shrink-0"
          color="blue-grey-3"
          text-color="blue-grey-9"
          :label="`#${tag}`"
          clickable
          removable
          square
          dense
          @click="removeHashtag(index)"
          @remove="removeHashtag(index)"
        />
      </div>
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

export default defineComponent({
  name: 'BaseInput',

  props: {
    modelValue: {
      type: String,
      default: '',
    },
    filled: {
      type: Boolean,
      default: true,
    },
    autogrow: {
      type: Boolean,
      default: true,
    },

    onlyNumber: Boolean,

    tags: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    useHashtags: Boolean,
  },

  emits: ['update:model-value', 'update:tags'],

  setup(props, { emit }) {
    const localModelValue = ref(props.modelValue);
    const allLocalTags = ref<string[]>(props.tags);
    watch(
      () => props.modelValue,
      () => (localModelValue.value = props.modelValue)
    );
    watch(
      () => props.tags,
      () => (allLocalTags.value = props.tags)
    );

    function handleInput(v: string) {
      localModelValue.value = v;
      emit('update:model-value', v);
    }

    function handleKeydown(e: KeyboardEvent) {
      const numberKeys = [
        '0',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '0',
        '.',
        ',',
        'Backspace',
        'Delete',
        'Enter',
        'ArrowLeft',
        'ArrowRight',
      ];
      if (props.onlyNumber && !numberKeys.includes(e.key)) e.preventDefault();

      const hashtagHotKeys = [',', 'Enter', ' '];
      if (props.useHashtags && hashtagHotKeys.includes(e.key)) {
        const target = e.target as EventTarget & { value: string };
        localModelValue.value = target?.value;
        addHashtag();
        e.preventDefault();
      }
    }
    function addHashtag() {
      if (!localModelValue.value) return;
      if (allLocalTags.value.find((t) => t === localModelValue.value)) {
        localModelValue.value = '';
        emit('update:model-value', '');
        return;
      }

      allLocalTags.value.push(localModelValue.value);
      localModelValue.value = '';
      emit('update:model-value', '');
      emit('update:tags', allLocalTags.value);
    }
    function removeHashtag(index: number) {
      allLocalTags.value.splice(index, 1);
      emit('update:tags', allLocalTags.value);
    }

    return {
      handleInput,

      allLocalTags,
      localModelValue,

      handleKeydown,
      addHashtag,
      removeHashtag,
    };
  },
});
</script>

<style lang="scss" scoped>
.base-input {
  &.base-input--hashtags {
    ::v-deep .q-field {
      &__prepend {
        height: auto;
      }
      &__control {
        flex: 1;
        flex-wrap: wrap;
      }
    }
  }
}
</style>
