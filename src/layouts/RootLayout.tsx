import { Outlet } from 'react-router';
import { StorageNotice } from '~/components/StorageNotice';

export function RootLayout() {
  return (
    <>
      <StorageNotice />
      <Outlet />
    </>
  );
}
