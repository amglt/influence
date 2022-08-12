import { PlayerPeriod } from '@prisma/client';

export interface PlayerPeriodWithTotalPoints extends PlayerPeriod {
  totalPoints: number;
  reward: number;
}

export interface PlayerWithPoints {
  totalPoints: number;
  id: number;
  username: string;
  guild?: string;
  nickname: string;
}

export interface GuildWithPoints {
  guild: string;
  totalPoints: number;
}
