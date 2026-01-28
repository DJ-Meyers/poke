interface StorageNoticeViewProps {
  onDismiss: () => void;
}

export function StorageNoticeView({ onDismiss }: StorageNoticeViewProps) {
  return (
    <div>
      <p>
        This site uses local storage to save your Living Dex progress directly
        in your browser. No data is sent to any server. If you clear your
        browsing history, you will lose your progress.
      </p>
      <button type="button" onClick={onDismiss}>
        Got it
      </button>
    </div>
  );
}
