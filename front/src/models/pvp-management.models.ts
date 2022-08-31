import { User } from './root.models';

export interface Period {
  id: number;
  startDate: Date;
  endDate?: Date;
  reward: number;
}

export interface Scale {
  percoAttackWinPoints: number;
  percoAttackLoosePoints: number;
  percoDefWinPoints: number;
  percoDefLoosePoints: number;
  percoNDPoints: number;
  prismAttackWinPoints: number;
  prismAttackLoosePoints: number;
  prismDefWinPoints: number;
  prismDefLoosePoints: number;
  prismNDPoints: number;
  bigPercoAttackWinPoints: number;
  bigPercoAttackLoosePoints: number;
  bigPercoDefWinPoints: number;
  bigPercoDefLoosePoints: number;
  bigPercoNDPoints: number;
  bigPrismAttackWinPoints: number;
  bigPrismAttackLoosePoints: number;
  bigPrismNDPoints: number;
  bigPrismDefWinPoints: number;
  bigPrismDefLoosePoints: number;
  bigPrismNAPoints: number;
  prismNAPoints: number;
  bigPercoNAPoints: number;
  percoNAPoints: number;
  avaWin: number;
  avaLoose: number;
}

export enum PvpGameResult {
  AttackWin,
  AttackLose,
  DefWin,
  DefLoose,
  AvaWin,
  AvaLoose,
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

export interface PvpGameWithPlayers {
  id: number;
  result: PvpGameResult;
  type: PvpGameType;
  status: PvpGameStatus;
  player1: User;
  player2?: User;
  player3?: User;
  player4?: User;
  player5?: User;
  period: Period;
}

export interface PeriodPlayerWithPoints {
  playerId: number;
  periodId: number;
  player: User;
  totalPoints: number;
  reward: number;
  rewarded: boolean;
}
