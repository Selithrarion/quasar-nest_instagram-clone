<template>
  <BaseDialog
    :confirm-text="step === CreatePostEnum.UPLOAD ? 'Upload' : 'Next'"
    :show-back-button="step !== CreatePostEnum.SELECT"
    :hide-close-button="step !== CreatePostEnum.SELECT"
    :title="title"
    large
    v-bind="$attrs"
    @close="close"
    @back="prevStep"
    @confirm="nextStep"
  >
    <div v-if="step === CreatePostEnum.SELECT" class="flex-center column gap-6 text-center">
      <CommonImageCropper ref="cropper" v-model="form.image" />
    </div>
    <div v-else-if="step === CreatePostEnum.EDIT">
      <CommonImageFilter v-model="form.image" :image="form.image" />
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import CommonImageCropper from 'components/common/image/CommonImageCropper.vue';
import CommonImageFilter from 'components/common/image/CommonImageFilter.vue';

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
  },

  emits: ['close'],

  setup(props, { emit }) {
    const cropper = ref<InstanceType<typeof CommonImageCropper>>();

    const step = ref<CreatePostEnum>(CreatePostEnum.SELECT);
    function prevStep() {
      if (step.value === CreatePostEnum.EDIT) step.value = CreatePostEnum.SELECT;
      else if (step.value === CreatePostEnum.UPLOAD) step.value = CreatePostEnum.EDIT;
    }
    function nextStep() {
      if (step.value === CreatePostEnum.SELECT) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        cropper.value?.cropImage();
        step.value = CreatePostEnum.EDIT;
      } else if (step.value === CreatePostEnum.EDIT) step.value = CreatePostEnum.UPLOAD;
      else if (step.value === CreatePostEnum.UPLOAD) {
        close();
      }
    }
    function close() {
      emit('close');
      step.value = CreatePostEnum.SELECT;
    }

    const title = computed(() => {
      if (step.value === CreatePostEnum.SELECT) return 'Create new post';
      else if (step.value === CreatePostEnum.EDIT) return 'Edit';
      else if (step.value === CreatePostEnum.UPLOAD) return 'Upload';
      else return '';
    });

    const form = ref({
      image: null,
    });

    return {
      cropper,

      CreatePostEnum,
      step,
      prevStep,
      nextStep,
      close,

      title,

      form,
    };
  },
});
</script>
