import { redirect, type LoaderFunctionArgs } from 'react-router';
import { isStorageNoticeDismissed } from '~/utils/storage-notice';

export const rootLayoutLoader = ({
  request,
}: LoaderFunctionArgs): Response | null => {
  if (isStorageNoticeDismissed()) {
    return null;
  }

  const basename = import.meta.env.BASE_URL.replace(/\/$/, '');
  const { pathname } = new URL(request.url);
  const appPath = pathname.replace(basename, '') || '/';

  if (appPath !== '/' && appPath !== '/dex') {
    return redirect('/dex');
  }

  return null;
};
