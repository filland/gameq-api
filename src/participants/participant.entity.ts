import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Participant {

  @PrimaryColumn({ type: "uuid" })
  queueId: string

  @PrimaryColumn({ type: "uuid" })
  userId: string

  @Column({ nullable: true })
  votes: number

  @Column()
  joinDate: Date
}