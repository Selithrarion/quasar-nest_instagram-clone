<template>
  <BaseItem :clickable="clickable">
    <q-item-section side>
      <BaseAvatar :size="size" :src="avatar" :item-name="username" :item-color="color" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ username }}</q-item-label>
      <q-item-label v-if="$slots.name || name" caption>
        <slot name="name" :user-name="name">
          {{ name }}
        </slot>
      </q-item-label>
    </q-item-section>

    <slot name="append" />

    <BaseTooltip :label="tooltip" />
  </BaseItem>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CommonUser',

  props: {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      required: true,
    },

    tooltip: {
      type: String,
      required: false,
      default: null,
    },

    size: {
      type: [Number, String],
      required: false,
      default: '56px',
    },
    clickable: {
      type: Boolean,
      required: false,
      default: true,
    },
  },

  setup() {
    return {};
  },
});
</script>
