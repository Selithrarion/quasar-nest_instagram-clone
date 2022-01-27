<template>
  <BaseItem :clickable="clickable && !useSkeleton">
    <q-item-section :class="{ 'self-start': alignAvatarToTop }" side>
      <q-skeleton v-if="useSkeleton" type="QAvatar" :size="size" />
      <BaseAvatar v-else :size="size" :src="user.avatar?.url" :item-name="user.username" :item-color="user.color" />
    </q-item-section>

    <q-item-section>
      <template v-if="useSkeleton">
        <q-skeleton type="text" width="90%" height="20px" />
        <q-skeleton v-if="useSkeletonUsername" type="text" width="60%" height="20px" />
      </template>

      <template v-else>
        <q-item-label>
          <slot name="username" :username="user.username">
            {{ user.username }}
          </slot>
        </q-item-label>
        <q-item-label v-if="$slots.name || !hideName" caption>
          <slot name="name" :user-name="user.name">
            {{ user.name }}
          </slot>
        </q-item-label>
      </template>
    </q-item-section>

    <slot v-if="!useSkeleton || (useSkeleton && useSkeletonAppend)" name="append" />

    <BaseTooltip :label="tooltip" />
  </BaseItem>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { UserModel } from 'src/models/user/user.model';

export default defineComponent({
  name: 'CommonUser',

  props: {
    useSkeleton: Boolean,
    useSkeletonUsername: Boolean,
    useSkeletonAppend: Boolean,

    user: {
      type: Object as PropType<UserModel>,
      default: () => {
        return {};
      },
    },
    hideName: Boolean,
    alignAvatarToTop: Boolean,

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
