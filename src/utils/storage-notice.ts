/**
 * Utilities for managing the storage notice banner dismissal state.
 */

const STORAGE_KEY = 'storage_notice_dismissed';

export const isStorageNoticeDismissed = (): boolean => {
  return localStorage.getItem(STORAGE_KEY) === 'true';
};

export const dismissStorageNotice = (): void => {
  localStorage.setItem(STORAGE_KEY, 'true');
};
