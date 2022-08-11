import { PlayerPeriod } from '@prisma/client';

export interface PlayerPeriodWithTotalPoints extends PlayerPeriod {
  totalPoints: number;
  reward: number;
}
