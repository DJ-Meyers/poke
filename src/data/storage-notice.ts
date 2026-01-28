import { queryOptions, useMutation, useQuery } from '@tanstack/react-query';
import {
  isStorageNoticeDismissed,
  dismissStorageNotice,
} from '~/utils/storage-notice';
import { queryClient } from './query-client';

// --- Query option factories (internal) ---

function storageNoticeOptions() {
  return queryOptions({
    queryKey: ['storage-notice'],
    queryFn: () => isStorageNoticeDismissed(),
  });
}

// --- Hooks (for components) ---

export function useIsStorageNoticeDismissed() {
  const { data } = useQuery(storageNoticeOptions());
  return { isDismissed: data ?? false };
}

// --- Mutations ---

export function useDismissStorageNotice() {
  return useMutation({
    mutationFn: () => {
      dismissStorageNotice();
      return Promise.resolve();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['storage-notice'] });
    },
  });
}
