import { Document } from 'mongoose';

export interface ITroops {
  memberDiscordId: string;
  gatherers: number;
  scavengers: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TroopsDocument extends ITroops, Document {}

export enum TROOP_TYPE {
  SCAVENGER = 'scavenger',
  GATHERER = 'gatherer',
}
