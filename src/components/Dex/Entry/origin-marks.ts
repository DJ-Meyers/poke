import type { Game } from '~/utils/dex-data';

import home from '~/assets/origin-marks/HOME.png';
import lgpe from '~/assets/origin-marks/LGPE.png';
import swsh from '~/assets/origin-marks/SWSH.png';
import bdsp from '~/assets/origin-marks/BDSP.png';
import pla from '~/assets/origin-marks/PLA.png';
import sv from '~/assets/origin-marks/SV.png';
import plza from '~/assets/origin-marks/PLZA.png';

export type OriginMarkId = Game | 'HOME';

export const ORIGIN_MARK_IMAGES: Record<OriginMarkId, string> = {
  HOME: home,
  LGPE: lgpe,
  SWSH: swsh,
  BDSP: bdsp,
  PLA: pla,
  SV: sv,
  PLZA: plza,
};

export interface OriginMark {
  game: OriginMarkId;
  caught: boolean;
}
