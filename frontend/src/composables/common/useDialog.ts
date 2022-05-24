import { ref, Ref } from 'vue';

interface DialogInterface {
  opened: Ref<DialogItem[]>;
  openedLocal: Ref<DialogItem[]>;
  openedItem: Ref<unknown | null>;
  isAnyLocal: Ref<boolean>;

  open: (name: string, options?: DialogOpenOptionsInterface) => void;
  close: () => void;
  getIsOpened: (name: string, key?: number | string) => boolean;
  resetLocal: () => void;

  loading: Ref<boolean>;
  startLoading: () => void;
  stopLoading: () => void;
}

interface DialogOpenOptionsInterface {
  item?: unknown;
  isLocal?: boolean;
}
interface DialogItem {
  name: string;
}

const opened = ref<DialogItem[]>([]);
const openedItem = ref<unknown | null>({});
const isAnyLocal = ref(false);

export default function useDialog(): DialogInterface {
  const openedLocal = ref<DialogItem[]>([]);

  function open(name: string, options: DialogOpenOptionsInterface = {}) {
    if (options.isLocal) {
      openedLocal.value.push({ name });
      isAnyLocal.value = true;
    } else opened.value.push({ name });

    openedItem.value = options.item || {};
  }
  function close() {
    if (openedLocal.value.length) {
      openedLocal.value.pop();
      isAnyLocal.value = Boolean(openedLocal.value.length);
    } else opened.value.pop();

    openedItem.value = {};
  }
  function getIsOpened(name: string): boolean {
    const isGlobal = Boolean(opened.value.find((d) => d.name === name));
    const isLocal = Boolean(openedLocal.value.find((d) => d.name === name));
    return isGlobal || isLocal;
  }
  function resetLocal(): void {
    openedLocal.value = [];
    isAnyLocal.value = false;
  }

  const loading = ref<boolean>(false);
  function startLoading() {
    loading.value = true;
  }
  function stopLoading() {
    loading.value = false;
  }

  return {
    opened,
    openedLocal,
    openedItem,
    isAnyLocal,

    open,
    close,
    getIsOpened,
    resetLocal,

    loading,
    startLoading,
    stopLoading,
  };
}
