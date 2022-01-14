<template>
  <BaseDialog
    :confirm-text="step === CreatePostEnum.UPLOAD ? 'Upload' : 'Next'"
    :show-back-button="step !== CreatePostEnum.SELECT"
    :hide-close-button="step !== CreatePostEnum.SELECT"
    :hide-confirm-button="!form.imageRaw"
    :title="title"
    :confirm-loading="loading.active.value"
    large
    v-bind="$attrs"
    @close="close"
    @back="prevStep"
    @confirm="nextStep"
  >
    <div v-show="step === CreatePostEnum.SELECT" class="flex-center column gap-6 text-center">
      <CommonImageCropper
        ref="cropper"
        v-model="form.imageBlob"
        v-model:image-raw="form.imageRaw"
        v-model:image-crop-data="form.imageCropData"
        v-model:aspect-ratio="form.imageAspectRatio"
      />
    </div>

    <div v-show="step === CreatePostEnum.EDIT">
      <CommonImageFilter
        ref="filter"
        :model-value="imageBlobURL"
        :ratio="form.imageAspectRatio"
        @update:model-value="form.imageBlobWithFilter = $event"
      />
    </div>

    <div v-show="step === CreatePostEnum.UPLOAD" class="row gap-4 no-wrap">
      <q-img
        class="w-66 flex-shrink-0"
        style="max-height: 60vh"
        fit="scale-down"
        :src="imageBlobWithFilterURL"
        :ratio="form.imageAspectRatio"
        :initial-ratio="form.imageAspectRatio"
      />
      <div class="w-33 flex-shrink-0">
        <CommonUser class="q-pl-none" size="28px" :user="currentUser" :clickable="false" hide-name />
        <q-input v-model="form.description" label="Description" autogrow counter />
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useStore } from 'src/store';
import useLoading from 'src/composables/common/useLoading';

import CommonImageCropper from 'components/common/image/CommonImageCropper.vue';
import CommonImageFilter from 'components/common/image/CommonImageFilter.vue';
import CommonUser from 'components/common/CommonUser.vue';

import postRepository from 'src/repositories/postRepository';

enum CreatePostEnum {
  SELECT = 'selectFile',
  EDIT = 'edit',
  UPLOAD = 'upload',
}

export default defineComponent({
  name: 'LayoutPostCreate',

  components: {
    CommonImageCropper,
    CommonImageFilter,
    CommonUser,
  },

  emits: ['close'],

  setup(props, { emit }) {
    const store = useStore();
    const loading = useLoading();

    const cropper = ref<InstanceType<typeof CommonImageCropper>>();
    const filter = ref<InstanceType<typeof CommonImageFilter>>();

    const step = ref<CreatePostEnum>(CreatePostEnum.SELECT);
    function prevStep() {
      if (step.value === CreatePostEnum.EDIT) step.value = CreatePostEnum.SELECT;
      else if (step.value === CreatePostEnum.UPLOAD) step.value = CreatePostEnum.EDIT;
    }
    function nextStep() {
      if (step.value === CreatePostEnum.SELECT) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        cropper.value?.getCroppedImageBlob();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        cropper.value?.getCroppedImageData();
        step.value = CreatePostEnum.EDIT;
      } else if (step.value === CreatePostEnum.EDIT) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        filter.value?.getFilteredImageBlob();
        step.value = CreatePostEnum.UPLOAD;
      } else if (step.value === CreatePostEnum.UPLOAD) {
        void uploadPost();
      }
    }
    function close() {
      emit('close');
      step.value = CreatePostEnum.SELECT;
      form.value = {
        imageRaw: null,
        imageAspectRatio: 1,
        imageBlob: null,
        imageBlobWithFilter: null,
        imageCropData: null,
        description: '',
      };
    }

    const title = computed(() => {
      if (step.value === CreatePostEnum.SELECT) return 'Create new post';
      else if (step.value === CreatePostEnum.EDIT) return 'Edit';
      else if (step.value === CreatePostEnum.UPLOAD) return 'Upload';
      else return '';
    });

    const form = ref({
      imageRaw: null,
      imageAspectRatio: 1,
      imageBlob: null,
      imageBlobWithFilter: null,
      imageCropData: null,

      description: '',
    });
    const imageBlobURL = computed(() => {
      const blob = form.value.imageBlob;
      if (!blob) return null;
      return URL.createObjectURL(blob);
    });
    const imageBlobWithFilterURL = computed(() => {
      const blob = form.value.imageBlobWithFilter;
      if (!blob) return null;
      return URL.createObjectURL(blob);
    });

    async function uploadPost() {
      try {
        loading.start();

        const formData = new FormData();
        formData.append('file', form.value.imageBlobWithFilter || '');
        formData.append('description', form.value.description);
        await postRepository.create(formData);
        loading.stop();

        close();
        await store.dispatch('post/getAll');
      } finally {
        loading.stop();
      }
    }

    const currentUser = computed(() => store.state.user.currentUser);

    return {
      loading,

      cropper,
      filter,

      CreatePostEnum,
      step,
      prevStep,
      nextStep,
      close,

      title,

      form,
      imageBlobURL,
      imageBlobWithFilterURL,

      currentUser,
    };
  },
});
</script>
