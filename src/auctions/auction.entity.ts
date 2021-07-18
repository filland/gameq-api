import { Exclude } from 'class-transformer';
import { User } from 'src/auth/user.entity';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Auction {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  description: string

  @Column()
  number_of_winners: number

  @Column()
  close_date: Date

  @Column()
  created_date: Date

  @Column({ default: false })
  closed: boolean

  @ManyToOne(() => User, user => user.ownedAuctions)
  owner: User

  // @ManyToMany(() => User, { eager: false })
  // @JoinTable({ name: "auctions_users" })
  // @Exclude({ toPlainOnly: true })
  // participants: User[]
}