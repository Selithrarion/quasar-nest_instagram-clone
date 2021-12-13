<template>
  <q-avatar class="base-avatar" :class="classes" :size="size" :style="styles" v-bind="$attrs">
    <slot>
      <BaseLoader
        v-if="loading"
        thickness="0.18"
        :small="parseInt(size) <= 24 || size === 'sm'"
        :medium="(parseInt(size) <= 36 && parseInt(size) >= 25) || size === 'md'"
        :color="whiteLoader ? 'white' : null"
        :gray-color="!whiteLoader"
        center
      />

      <q-img v-else-if="src" class="rounded-full" ratio="1" :src="src" :alt="`${itemName} Avatar`">
        <template #loading>
          <BaseLoader
            thickness="0.18"
            :small="parseInt(size) <= 24 || size === 'sm'"
            :medium="(parseInt(size) <= 36 && parseInt(size) >= 25) || size === 'md'"
            :color="whiteLoader ? 'white' : null"
            :gray-color="!whiteLoader"
            center
          />
        </template>
      </q-img>

      <q-icon v-else-if="showIcon" name="person" color="white" :size="iconSize" />

      <span v-else-if="itemName" class="text-white">{{ itemInitials }}</span>
    </slot>

    <BaseTooltip :label="tooltip || itemName" />

    <div v-if="clickable" class="base-avatar__hover" />
  </q-avatar>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'BaseAvatar',

  props: {
    src: {
      type: String,
      required: false,
      default: null,
    },

    itemName: {
      type: String,
      required: false,
      default: null,
    },
    itemColor: {
      type: String,
      required: false,
      default: null,
    },

    iconSize: {
      type: String,
      required: false,
      default: '16px',
    },
    showIcon: Boolean,

    loading: Boolean,
    whiteLoader: Boolean,

    clickable: Boolean,

    size: {
      type: String,
      required: false,
      default: '24px',
    },

    tooltip: {
      type: String,
      required: false,
      default: null,
    },
  },

  setup(props) {
    const itemInitials = computed(() => String(props.itemName).slice(0, 2).toUpperCase());
    const isHslOrRgbItemColor = computed(() => props.itemColor?.includes('hsl') || props.itemColor?.includes('rgb'));

    const classes = computed(() => {
      return {
        [`bg-${props.itemColor}`]: !isHslOrRgbItemColor.value && !props.src,
        'base-avatar--clickable': props.clickable,
      };
    });
    const styles = computed(() => {
      const styles = [];

      if (props.src) styles.push({ background: 'white' });
      else if (isHslOrRgbItemColor.value) styles.push({ background: props.itemColor });

      return styles;
    });

    return {
      itemInitials,
      classes,
      styles,
    };
  },
});
</script>

<style lang="scss">
.base-avatar {
  position: relative;

  &.base-avatar--clickable {
    cursor: pointer;
    &:hover .base-avatar__hover {
      opacity: 1;
    }
    .base-avatar__hover {
      position: absolute;
      top: 0;
      left: 0;

      display: flex;
      justify-content: center;
      align-items: center;

      height: inherit;
      width: inherit;

      background: rgba(88, 105, 181, 0.4);
      transition: background 1000ms ease, opacity 300ms ease;
      opacity: 0;
      border-radius: 100%;
    }
  }
}
</style>
