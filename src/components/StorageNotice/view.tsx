interface StorageNoticeViewProps {
  onDismiss: () => void;
}

export const StorageNoticeView = ({ onDismiss }: StorageNoticeViewProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-surface rounded-xl p-5 mx-4 w-full max-w-sm space-y-4">
        <h2 className="text-lg font-semibold text-text text-center">
          Before You Begin
        </h2>

        <p className="text-sm text-text text-center">
          This site uses local storage to save your Living Dex progress directly
          in your browser. No data is sent to any server. If you clear your
          browsing history, you will lose your progress.
        </p>

        <button
          type="button"
          onClick={onDismiss}
          className="w-full py-2 px-3 rounded-lg text-sm font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors cursor-pointer"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
