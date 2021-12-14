<template>
  <BaseItem>
    <q-item-section side>
      <BaseAvatar size="56px" :src="avatar" :item-name="username" :item-color="color" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ username }}</q-item-label>
      <q-item-label caption>
        <slot name="name" :user-name="name">
          {{ name }}
        </slot>
      </q-item-label>
    </q-item-section>

    <slot name="append" />
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
      required: true,
    },

    avatar: {
      type: String,
      default: null,
    },
    color: {
      type: String,
      required: true,
    },
  },

  setup() {
    return {};
  },
});
</script>
