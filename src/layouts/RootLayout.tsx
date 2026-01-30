import { Outlet } from 'react-router';
import { StorageNotice } from '~/components/StorageNotice';

export const RootLayout = () => {
  return (
    <>
      <StorageNotice />
      <Outlet />
    </>
  );
};
