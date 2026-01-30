import {
  useIsStorageNoticeDismissed,
  useDismissStorageNotice,
} from '~/data/storage-notice';
import { StorageNoticeView } from './view';

export const StorageNoticeContainer = () => {
  const { isDismissed } = useIsStorageNoticeDismissed();
  const dismiss = useDismissStorageNotice();

  const handleDismiss = () => {
    dismiss.mutate();
  };

  if (isDismissed) {
    return null;
  }

  return <StorageNoticeView onDismiss={handleDismiss} />;
};
