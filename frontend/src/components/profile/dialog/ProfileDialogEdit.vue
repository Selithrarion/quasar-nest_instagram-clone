<template>
  <BaseDialog
    title="Edit profile"
    :model-value="modelValue"
    :confirm-loading="loading.active.value"
    large
    @close="close"
    @confirm="confirm"
  >
    <q-input v-model="form.name" label="Name" filled />
    <q-input v-model="form.username" label="Username" :rules="[rules.uniqueUsername]" filled />
    <q-input v-model="form.website" label="Website" filled />
    <q-input v-model="form.description" label="Bio" filled />

    <div class="column gap-1">
      <div class="text-subtitle1 text-blue-grey-4">Personal Information</div>
      <div class="text-caption text-blue-grey-4">
        Provide your personal information, even if the account is used for a business, a pet or something else. This
        won't be a part of your public profile (and we won't use your data at least a couple of minutes... 😊👍).
      </div>
    </div>

    <BaseSelect v-model="form.gender" label="Gender" option-value="key" :options="genders" filled />
  </BaseDialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { useStore } from 'src/store';
import useLoading from 'src/composables/common/useLoading';
import useFormValidation from 'src/composables/form/useFormValidation';

import { UserModel } from 'src/models/user/user.model';

export default defineComponent({
  name: 'ProfileDialogEdit',

  props: {
    modelValue: {
      type: Boolean,
      required: true,
    },
    profile: {
      type: Object as PropType<UserModel>,
      default: () => {
        return {};
      },
    },
  },

  emits: ['updated', 'close'],

  setup(props, { emit }) {
    const store = useStore();
    const rules = useFormValidation(store.state.user.currentUser);
    const loading = useLoading();

    const genders = [
      {
        key: 'male',
        name: 'Male',
      },
      {
        key: 'female',
        name: 'Female',
      },
      {
        key: 'other',
        name: 'Other',
      },
    ];
    const form = ref({
      name: props.profile.name || '',
      username: props.profile.username || '',
      website: props.profile.website || '',
      description: props.profile.description || '',
      phone: props.profile.phone || '',
      gender: props.profile.gender || '',
    });

    async function confirm() {
      try {
        loading.start();

        const payload = {
          id: props.profile.id,
          payload: form.value,
        };
        await store.dispatch('user/update', payload);
        emit('updated', form.value);

        close();
      } finally {
        loading.stop();
      }
    }
    function close() {
      emit('close');
    }

    return {
      rules,
      loading,

      genders,
      form,
      confirm,
      close,
    };
  },
});
</script>
