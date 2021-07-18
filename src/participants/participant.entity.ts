import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Participant {

  @PrimaryColumn()
  auctionId: string

  @PrimaryColumn()
  userId: string
}