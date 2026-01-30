import type { Game, GameDex } from '~/utils/dex-data';
import { getDexDisplayName } from '~/utils/dex-data';
import type { DexProgressInfo } from '~/data/dex-progress';

interface DexManageModalViewProps {
  game: Game;
  dexes: GameDex[];
  dexProgressInfo: DexProgressInfo[];
  onCompleteDex: (gameDex: GameDex) => void;
  onResetDex: (gameDex: GameDex) => void;
  onClose: () => void;
}

export const DexManageModalView = ({
  game,
  dexes,
  dexProgressInfo,
  onCompleteDex,
  onResetDex,
  onClose,
}: DexManageModalViewProps) => {
  const progressMap = new Map(dexProgressInfo.map((d) => [d.gameDex, d]));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
      onClick={onClose}
    >
      <div
        className="bg-surface rounded-xl p-5 mx-4 w-full max-w-sm space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center">
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors cursor-pointer"
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-5 h-5"
            >
              <path
                fillRule="evenodd"
                d="M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <h2 className="text-lg font-semibold text-text text-center flex-1 pr-5">
            Manage {game} Dex Progress
          </h2>
        </div>

        <div className="space-y-3">
          {dexes.map((gameDex) => {
            const progress = progressMap.get(gameDex);
            return (
              <div key={gameDex} className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-text">
                    {getDexDisplayName({ gameDex })}
                  </p>
                  {progress && (
                    <p className="text-sm font-medium text-primary">
                      {progress.caughtCount} / {progress.totalCount}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onCompleteDex(gameDex)}
                    className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-primary/15 text-primary hover:bg-primary/25 transition-colors cursor-pointer"
                  >
                    Complete
                  </button>
                  <button
                    type="button"
                    onClick={() => onResetDex(gameDex)}
                    className="flex-1 py-2 px-3 rounded-lg text-sm font-medium bg-red-500/15 text-red-400 hover:bg-red-500/25 transition-colors cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
