<template>
  <component
    :is="currentComponent"
    class="base-button"
    :class="classes"
    :icon="icon"
    :unelevated="unelevated === undefined ? Boolean(icon) : unelevated"
    :round="round === undefined ? Boolean(icon) : round"
    :no-wrap="noWrap"
    no-caps
    v-bind="$attrs"
  >
    <BaseTooltip
      v-if="tooltip"
      :label="tooltip"
      :anchor="tooltipTopPosition ? 'top middle' : tooltipAnchor"
      :self="tooltipTopPosition ? 'bottom middle' : tooltipSelf"
      :transition-show="tooltipTopPosition ? 'jump-up' : 'jump-down'"
      :transition-hide="tooltipTopPosition ? 'jump-down' : 'jump-up'"
    />
    <slot> {{ label }} </slot>
  </component>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'BaseButton',

  props: {
    label: {
      type: String,
      default: null,
    },

    icon: {
      type: String,
      default: undefined,
    },
    unelevated: {
      type: Boolean,
      default: undefined,
    },
    round: {
      type: Boolean,
      default: undefined,
    },

    // tooltip text
    tooltip: {
      type: String,
      default: null,
    },
    // move tooltip to top or use default bottom position
    tooltipTopPosition: Boolean,
    // quasar custom tooltip position
    tooltipAnchor: {
      type: String,
      default: 'bottom middle',
    },
    tooltipSelf: {
      type: String,
      default: 'top middle',
    },

    secondaryColor: Boolean,
    plainStyle: Boolean,

    noWrap: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const classes = computed(() => {
      return {
        'base-button--secondary': props.secondaryColor,
        'base-button--plain-style': props.plainStyle,
      };
    });

    const currentComponent = computed(() => {
      return props.plainStyle ? 'button' : 'q-btn';
    });

    return {
      classes,
      currentComponent,
    };
  },
});
</script>

<style lang="scss" scoped>
.base-button {
  ::v-deep .q-btn__content {
    gap: 6px;
    .q-icon {
      margin-left: 0;
      margin-right: 0;
    }
  }
  &.q-btn:active {
    transition: transform 300ms ease-out;
    transform: scale(0.95);
  }

  &--secondary {
    background-color: $blue-grey-1 !important;
    color: $blue-grey-8 !important;
    font-weight: 500 !important;
  }
  &--plain-style {
    cursor: pointer;
    background-color: transparent;
    outline: none;
    box-shadow: none;
    border: none;
    padding: 0;
    opacity: 0.6;
    &:hover {
      color: $blue-grey-8;
      opacity: 1;
      text-decoration: underline;
    }
  }
}
</style>
