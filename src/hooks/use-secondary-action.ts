import { useCallback, useRef } from 'react';

const LONG_PRESS_DURATION = 500;
const MOVE_THRESHOLD = 10;

interface MobilePressAndHoldHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchEnd: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
}

interface RightClickHandlers {
  onContextMenu: (e: React.MouseEvent) => void;
}

interface SecondaryActionHandlers {
  onMobilePressAndHold: MobilePressAndHoldHandlers;
  onRightClick: RightClickHandlers;
}

/**
 * Returns platform-specific event handlers that trigger a secondary action.
 *
 * - **Mobile**: fires after a 500 ms press-and-hold. Cancels if the finger moves.
 * - **Desktop**: fires on right-click (contextmenu).
 *
 * Spread both groups onto the interactive element:
 * ```tsx
 * <button {...onMobilePressAndHold} {...onRightClick} />
 * ```
 */
export const useSecondaryActionHandlers = (
  onSecondaryAction: (() => void) | undefined
): SecondaryActionHandlers => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const firedRef = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  const clear = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (!onSecondaryAction) return;
      firedRef.current = false;
      const touch = e.touches[0];
      startPos.current = { x: touch.clientX, y: touch.clientY };
      timerRef.current = setTimeout(() => {
        firedRef.current = true;
        onSecondaryAction();
      }, LONG_PRESS_DURATION);
    },
    [onSecondaryAction]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      clear();
      // If the long press fired, prevent the subsequent click/navigation
      if (firedRef.current) {
        e.preventDefault();
      }
    },
    [clear]
  );

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!timerRef.current) return;
      const touch = e.touches[0];
      const dx = Math.abs(touch.clientX - startPos.current.x);
      const dy = Math.abs(touch.clientY - startPos.current.y);
      if (dx > MOVE_THRESHOLD || dy > MOVE_THRESHOLD) {
        clear();
      }
    },
    [clear]
  );

  const onContextMenu = useCallback(
    (e: React.MouseEvent) => {
      if (!onSecondaryAction) return;
      e.preventDefault();
      // On desktop, fire immediately on right-click.
      // On mobile, the touch handlers already fired the callback,
      // so we only fire here if it wasn't a touch-initiated event.
      if (!firedRef.current) {
        onSecondaryAction();
      }
    },
    [onSecondaryAction]
  );

  return {
    onMobilePressAndHold: { onTouchStart, onTouchEnd, onTouchMove },
    onRightClick: { onContextMenu },
  };
};
