<template>
  <BaseItem :clickable="clickable && !useSkeleton">
    <q-item-section side>
      <q-skeleton v-if="useSkeleton" type="QAvatar" :size="size" />
      <BaseAvatar v-else :size="size" :src="avatar" :item-name="username" :item-color="color" />
    </q-item-section>

    <q-item-section>
      <template v-if="useSkeleton">
        <q-skeleton type="text" width="50%" height="20px" />
        <q-skeleton v-if="useSkeletonUsername" type="text" width="40%" height="20px" />
      </template>

      <template v-else>
        <q-item-label>{{ username }}</q-item-label>
        <q-item-label v-if="$slots.name || name" caption>
          <slot name="name" :user-name="name">
            {{ name }}
          </slot>
        </q-item-label>
      </template>
    </q-item-section>

    <slot v-if="!useSkeleton || (useSkeleton && useSkeletonAppend)" name="append" />

    <BaseTooltip :label="tooltip" />
  </BaseItem>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CommonUser',

  props: {
    useSkeleton: Boolean,
    useSkeletonUsername: Boolean,
    useSkeletonAppend: Boolean,

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
