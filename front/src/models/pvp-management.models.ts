import { Key } from 'react';

export interface Period {
  id: number;
  startDate: Date;
  endDate?: Date;
}

export interface Rate {
  id: Key;
  gamesAmount: number;
  rate: number;
}

export interface Scale {
  percoWinPoints: number;
  percoNDPoints: number;
  percoLoosePoints: number;
  prismWinPoints: number;
  prismNDPoints: number;
  prismLoosePoints: number;
  bigPercoWinPoints: number;
  bigPercoNDPoints: number;
  bigPercoLoosePoints: number;
  bigPrismWinPoints: number;
  bigPrismNDPoints: number;
  bigPrismLoosePoints: number;
  avaWin: number;
  avaLoose: number;
  rates: Rate[];
}
