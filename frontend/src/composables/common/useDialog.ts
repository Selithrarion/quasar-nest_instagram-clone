import { ref, Ref } from 'vue';

interface DialogInterface {
  opened: Ref<string[]>;
  openedItem: Ref<unknown | null>;
  open: (name: string, options?: DialogOpenOptionsInterface) => void;
  close: () => void;
  isOpened: (name: string) => boolean;

  loading: Ref<boolean>;
  startLoading: () => void;
  stopLoading: () => void;
}

interface DialogOpenOptionsInterface {
  item?: unknown;
}

const opened = ref<string[]>([]);
const openedItem = ref<unknown | null>({});

export default function useDialog(): DialogInterface {
  function open(name: string, options: DialogOpenOptionsInterface = {}) {
    opened.value.push(name);
    openedItem.value = options.item;
  }
  function close() {
    opened.value.pop();
    openedItem.value = {};
  }
  function isOpened(name: string): boolean {
    return Boolean(opened.value.find((m) => m === name));
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
    openedItem,
    open,
    close,
    isOpened,

    loading,
    startLoading,
    stopLoading,
  };
}
