<template>
  <q-avatar
    class="base-avatar"
    :class="classes"
    :size="size"
    :square="square"
    :style="styles"
    v-bind="$attrs"
    @click="uploadAvatar ? $refs.avatarInput.click() : null"
  >
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

      <q-img
        v-else-if="src"
        :class="{ 'rounded-full': !square }"
        ratio="1"
        :src="src"
        :alt="itemName ? `${itemName} Avatar` : ''"
      >
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

      <q-icon v-else-if="showIcon" :name="icon" :color="iconColor" :size="iconSize" />

      <span v-else-if="itemName" class="text-white">{{ itemInitials }}</span>
    </slot>

    <slot name="badge" />

    <BaseTooltip :label="tooltip || itemName" />

    <div v-if="clickable" class="base-avatar__hover" />

    <!--TODO: add image crop? gif support?-->
    <input
      v-if="uploadAvatar"
      ref="avatarInput"
      class="hidden absolute-full"
      type="file"
      accept="image/*"
      @input="emitAvatarFile"
    />
  </q-avatar>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from 'vue';

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
    iconColor: {
      type: String,
      required: false,
      default: 'white',
    },
    icon: {
      type: String,
      required: false,
      default: 'person',
    },
    showIcon: Boolean,

    loading: Boolean,
    whiteLoader: Boolean,

    clickable: Boolean,
    uploadAvatar: Boolean,

    border: Boolean,

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

    square: Boolean,
  },

  emits: ['select-avatar'],

  setup(props, { emit }) {
    const itemInitials = computed(() => String(props.itemName).slice(0, 2).toUpperCase());
    const isHslOrRgbItemColor = computed(() => props.itemColor?.includes('hsl') || props.itemColor?.includes('rgb'));

    const classes = computed(() => {
      return {
        [`bg-${props.itemColor}`]: !isHslOrRgbItemColor.value && !props.src,
        'base-avatar--clickable': props.clickable,
        'base-avatar--border': props.border,
      };
    });
    const styles = computed(() => {
      const styles = [];

      if (props.src) styles.push({ background: 'white' });
      else if (isHslOrRgbItemColor.value) styles.push({ background: props.itemColor });

      return styles;
    });

    const avatarInput = ref<HTMLInputElement | null>(null);
    function emitAvatarFile() {
      const file = avatarInput.value?.files?.[0];
      if (!file) return;
      emit('select-avatar', file);
    }

    return {
      itemInitials,
      classes,
      styles,

      avatarInput,
      emitAvatarFile,
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
  &.base-avatar--border {
    border: 1px solid $blue-grey-3;
  }
}
</style>
