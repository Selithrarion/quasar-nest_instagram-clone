<template>
  <BaseDialog
    title="Report post"
    :model-value="modelValue"
    :confirm-loading="loading.active.value"
    :actions="step === ReportSteps.DONE"
    hide-confirm-button
    @close="$emit('close')"
  >
    <div v-show="step === ReportSteps.REASON" class="column gap-2">
      <div class="text-body1 text-weight-bold">Why are you reporting this post?</div>
      <q-list bordered separator>
        <BaseItem
          v-for="report in availableReports"
          :key="report.value"
          :label="report.label"
          :loading="loading.active.value && selectedReportID === report.value"
          @click="selectReason(report.value)"
        />
      </q-list>
    </div>

    <div v-show="step === ReportSteps.DONE">
      <div class="column gap-2 text-center">
        <div>
          <q-icon name="check_circle_outline" color="green-5" size="48px" />
        </div>
        <div class="text-body2 text-weight-bold">Don't want to see this?</div>
        <div class="text-blue-grey-5">
          When you see something you don't like on Instagram, you can report it if it doesn't follow our Community
          Guidelines, or you can remove the person who shared it from your experience.
        </div>
      </div>
    </div>

    <!--    <q-input v-model="localDescription" label="Description" autogrow filled counter />-->
  </BaseDialog>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import useLoading from 'src/composables/common/useLoading';

import { PostModel, PostReportTypes } from 'src/models/feed/post.model';
import postRepository from 'src/repositories/postRepository';

enum ReportSteps {
  REASON = 'reason',
  DONE = 'done',
}

export default defineComponent({
  name: 'FeedPostDialogReport',

  props: {
    modelValue: Boolean,
    post: {
      type: Object as PropType<PostModel>,
      default: null,
    },
  },

  emits: ['close'],

  setup(props) {
    const loading = useLoading();

    // fetch from backend and change if needed from admin panel?
    const availableReports = ref([
      {
        label: "It's spam",
        value: PostReportTypes.SPAM,
      },
      {
        label: 'Nudity or sexual activity',
        value: PostReportTypes.NUDITY,
      },
      {
        label: 'Hate speech or symbols',
        value: PostReportTypes.HATE,
      },
      {
        label: 'Bulling or harassment',
        value: PostReportTypes.BULLING,
      },
      {
        label: 'Intellectual property violation',
        value: PostReportTypes.AUTHOR_RIGHTS,
      },
      {
        label: 'Suicide or self-injury',
        value: PostReportTypes.SUICIDE,
      },
      {
        label: 'Scam or fraud',
        value: PostReportTypes.SCAM,
      },
      {
        label: 'False information',
        value: PostReportTypes.FALSE_INFORMATION,
      },
      {
        label: "I just don't like it",
        value: PostReportTypes.DONT_LIKE,
      },
    ]);
    const selectedReportID = ref<PostReportTypes | null>(null);
    watch(
      () => props.modelValue,
      () => {
        selectedReportID.value = null;
        step.value = ReportSteps.REASON;
      }
    );

    const step = ref<ReportSteps>(ReportSteps.REASON);

    async function selectReason(reportID: number) {
      try {
        loading.start();
        selectedReportID.value = reportID;

        await postRepository.report(props.post.id, reportID);

        step.value = ReportSteps.DONE;
      } finally {
        loading.stop();
      }
    }

    return {
      loading,
      ReportSteps,

      availableReports,
      selectedReportID,
      step,
      selectReason,
    };
  },
});
</script>
