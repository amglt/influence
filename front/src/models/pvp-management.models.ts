export interface Period {
  id: number;
  startDate: Date;
  endDate?: Date;
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
  avaWin: number;
  avaLoose: number;
}

export enum PvpGameResult {
  AttackWin,
  AttackLoose,
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

export interface PeriodPlayerPoints {
  playerId: string;
  periodId: number;
  totalPoints: number;
}
