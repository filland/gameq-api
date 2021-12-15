import { User } from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Queue {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @Column()
  number_of_winners: number

  @Column()
  closeDate: Date

  @Column()
  createdDate: Date

  @Column({ default: false })
  closed: boolean

  @ManyToOne(() => User, user => user.ownedQueues)
  owner: User

  // @ManyToMany(() => User, { eager: false })
  // @JoinTable({ name: "queues_users" })
  // @Exclude({ toPlainOnly: true })
  // participants: User[]
}