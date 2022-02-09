<template>
  <q-input
    class="base-input"
    :class="{ 'base-input--hashtags': useHashtags }"
    :model-value="modelValue"
    :filled="filled"
    :autogrow="autogrow"
    v-bind="$attrs"
    @keydown="handleKeydown"
    @update:model-value="handleInput"
  >
    <template #prepend>
      <div class="row wrap q-pt-xs">
        <q-chip
          v-for="tag in allLocalTags"
          :key="tag"
          class="flex-shrink-0"
          color="blue-grey-3"
          text-color="blue-grey-9"
          :label="`#${tag}`"
          removable
          square
          dense
          @remove="removeHashtag"
        />
      </div>
    </template>
  </q-input>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

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
    useHashtags: Boolean,
  },

  emits: ['update:model-value', 'update:tags'],

  setup(props, { emit }) {
    const localModelValue = ref(props.modelValue);
    const allLocalTags = ref<string[]>([]);

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
        addHashtag();
        e.preventDefault();
      }
    }
    function addHashtag() {
      if (!localModelValue.value) return;
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
