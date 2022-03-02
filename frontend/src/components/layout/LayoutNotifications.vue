<template>
  <BaseButton icon="favorite" size="18px" :tooltip="t('notification.notifications')" unelevated dense round>
    <BaseMenu style="height: 360px" :offset="[0, 16]">
      <q-list class="layout-notifications">
        <BaseLoader v-if="loading.active.value" center />

        <div v-else-if="!filteredNotifications.length" class="layout-notifications__empty">
          <div v-if="isShowOnlyUnread">
            {{ t('notification.noUnreadLast30Days') }}
          </div>
          <div v-else>
            {{ t('notification.noLast30Days') }}
          </div>
        </div>

        <template v-else>
          <div class="layout-notifications__section-header flex-center-between q-py-sm q-pl-md q-px-lg">
            <CommonListTitle class="text-weight-medium" title="Recent" />
          </div>
          <div class="layout-notifications__section-content">
            <CommonUser
              v-for="notification in filteredNotifications"
              :key="notification.id"
              :user="notification.initiatorUser"
              hide-name
              @click="handleItemClick(notification)"
            >
              <template #username="{ username }">
                <b>{{ username }}</b>
                {{ getNotificationTitleByType(notification.type) }}
                <span class="text-blue-grey-4 text-caption q-pl-xs">
                  {{ formatDate(notification.createdAt, DateTypes.DIFF) }}
                </span>
              </template>

              <template #append>
                <BaseAvatar :src="notification.post?.fileURL" size="40px" square />
              </template>
            </CommonUser>
          </div>
        </template>
      </q-list>
    </BaseMenu>
  </BaseButton>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { DateTypes, useFormat } from 'src/composables/format/useFormat';
import useLoading from 'src/composables/common/useLoading';

import CommonListTitle from 'components/common/CommonListTitle.vue';
import CommonUser from 'components/common/CommonUser.vue';

import notificationRepository from 'src/repositories/notificationRepository';
import { NotificationModel, NotificationTypes } from 'src/models/user/notification.model';

export default defineComponent({
  name: 'LayoutNotifications',

  components: {
    CommonListTitle,
    CommonUser,
  },

  setup() {
    const router = useRouter();
    const { t } = useI18n();
    const { formatDate } = useFormat();
    const loading = useLoading({ default: true });

    const notifications = ref<NotificationModel[]>([]);
    onBeforeMount(async () => {
      notifications.value = await notificationRepository.getAll();
      loading.stop();
    });

    function getNotificationTitleByType(type: string) {
      return t(`notification.typeTitles.${type}`);
    }

    const filteredNotifications = computed(() => {
      if (isShowOnlyUnread.value) return notifications.value.filter((n) => !n.read);
      else return notifications.value;
    });
    const isShowOnlyUnread = ref(false);

    async function readNotification(id: number) {
      const itemIndex = notifications.value.findIndex((n) => n.id === id);
      if (notifications.value[itemIndex].read === true) return;

      notifications.value[itemIndex].read = false;
      await notificationRepository.update(id, { read: true });
    }
    async function toggleNotificationRead(id: number) {
      const itemIndex = notifications.value.findIndex((n) => n.id === id);
      notifications.value[itemIndex].read = !notifications.value[itemIndex].read;
      await notificationRepository.update(id, { read: notifications.value[itemIndex].read });
    }

    const canReadAll = computed(() => notifications.value.some((n) => !n.read));
    async function readAll() {
      notifications.value.forEach((n) => (n.read = true));
      await notificationRepository.readAll();
    }

    function handleItemClick(item: NotificationModel) {
      const isPostActivity =
        item.type === NotificationTypes.LIKED_PHOTO ||
        item.type === NotificationTypes.LIKED_VIDEO ||
        item.type === NotificationTypes.LIKED_COMMENT;
      const isUserActivity = item.type === NotificationTypes.FOLLOWED;

      if (isPostActivity) void router.push(`/post/${item.post.id}`);
      else if (isUserActivity) void router.push(`/profile/${item.initiatorUser.username}`);
    }

    return {
      t,
      loading,
      formatDate,
      DateTypes,

      getNotificationTitleByType,
      filteredNotifications,
      isShowOnlyUnread,

      readNotification,
      toggleNotificationRead,

      canReadAll,
      readAll,

      handleItemClick,
    };
  },
});
</script>

<style lang="scss" scoped>
.layout-notifications {
  position: relative;
  width: 500px;

  &__section-header {
    position: sticky;
    top: 0;
    background-color: white;
    z-index: 1;
  }
  &__section-content {
    position: sticky;
    top: 36px;
    z-index: 1;
  }

  &__empty {
    display: flex;
    flex-flow: column;
    align-items: center;
    gap: 16px;
    padding-top: 64px;
  }
  &__empty-image {
    background: url('src/assets/svg/empty-list.svg') center no-repeat;
    background-size: 100%;
    width: 198px;
    height: 240px;
  }
}
</style>
