import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Vote {

  @PrimaryGeneratedColumn("uuid")
  id: string

  // id column in the queue table
  @Column({ type: "uuid" })
  queueId: string

  // id column in the user table
  @Column({ type: "uuid" })
  voterId: string

  // id column in the user table
  @Column({ type: "uuid" })
  participantId: string

  // this field describes how many votes was given by the voter to the participant
  votes: number
}