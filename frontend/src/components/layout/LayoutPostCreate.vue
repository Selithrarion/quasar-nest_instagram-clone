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
        :width="form.imageCropData?.width"
        :height="form.imageCropData?.height"
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
        <BaseInput v-model="form.description" label="Description" autofocus counter />
        <BaseInput
          v-model="tagSearch"
          v-model:tags="form.tags"
          class="q-pt-sm"
          label="Tags"
          use-hashtags
          @update:model-value="searchTags"
        />
        <q-list v-if="tagSuggestion.length" class="q-mt-sm shadow-4" style="max-height: 255px; overflow-y: scroll">
          <BaseItem
            v-for="tag in tagSuggestion"
            :key="tag.name"
            style="height: 51px"
            @click="addSuggestedTag(tag.name)"
          >
            <q-item-section>
              <q-item-label>#{{ tag.name }}</q-item-label>
              <q-item-label caption>{{ tag.count }} {{ t('post.posts', tag.count) }}</q-item-label>
            </q-item-section>
          </BaseItem>
        </q-list>
      </div>
    </div>
  </BaseDialog>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useStore } from 'src/store';
import useLoading from 'src/composables/common/useLoading';
import { debounce } from 'quasar';

import CommonImageCropper from 'components/common/image/CommonImageCropper.vue';
import CommonImageFilter from 'components/common/image/CommonImageFilter.vue';
import CommonUser from 'components/common/CommonUser.vue';

import postRepository from 'src/repositories/postRepository';
import { TagModel } from 'src/models/feed/tag.model';

interface PostForm {
  imageRaw: string | null;
  imageAspectRatio: number;
  imageBlob: Blob | null;
  imageBlobWithFilter: Blob | null;
  imageCropData: unknown;

  description: string;
  tags: string[];
}

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
    const { t } = useI18n();
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
      tagSearch.value = '';
      tagSuggestion.value = [];
      form.value = {
        imageRaw: null,
        imageAspectRatio: 1,
        imageBlob: null,
        imageBlobWithFilter: null,
        imageCropData: null,
        description: '',
        tags: [],
      };
    }

    const title = computed(() => {
      if (step.value === CreatePostEnum.SELECT) return 'Create new post';
      else if (step.value === CreatePostEnum.EDIT) return 'Edit';
      else if (step.value === CreatePostEnum.UPLOAD) return 'Upload';
      else return '';
    });

    const form = ref<PostForm>({
      imageRaw: null,
      imageAspectRatio: 1,
      imageBlob: null,
      imageBlobWithFilter: null,
      imageCropData: null,

      description: '',
      tags: [],
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

    const tagSearch = ref('');
    const tagSuggestion = ref<TagModel[]>([]);
    function addSuggestedTag(tag: string) {
      if (form.value.tags.find((t) => t === tag)) {
        tagSearch.value = '';
        tagSuggestion.value = [];
        return;
      }
      tagSearch.value = '';
      tagSuggestion.value = [];
      form.value.tags.push(tag);
    }
    const searchTags = debounce(async () => {
      tagSuggestion.value = await postRepository.getTags(tagSearch.value);
    }, 400);

    async function uploadPost() {
      try {
        loading.start();

        const formData = new FormData();
        formData.append('file', form.value.imageBlobWithFilter || '');
        formData.append('description', form.value.description);
        formData.append('tags', JSON.stringify(form.value.tags));
        await postRepository.create(formData);

        close();
        await store.dispatch('post/getAll');
      } finally {
        loading.stop();
      }
    }

    const currentUser = computed(() => store.state.user.currentUser);

    return {
      t,
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

      tagSearch,
      tagSuggestion,
      addSuggestedTag,
      searchTags,

      currentUser,
    };
  },
});
</script>
