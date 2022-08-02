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

export enum PvpGameResult {
  Loose,
  Win,
  ND,
}

export enum PvpGameType {
  Perco,
  Prism,
  AvA,
}

export enum PvpGameStatus {
  Pending,
  Rejected,
  Accepted,
}

export interface PvpGame {
  id: number;
  result: PvpGameResult;
  type: PvpGameType;
  status: PvpGameStatus;
  player1: string;
  player2?: string;
  player3?: string;
  player4?: string;
  player5?: string;
  period: Period;
}
