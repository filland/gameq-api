import { Exclude } from 'class-transformer';
import { Auction } from 'src/auctions/auction.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column({ unique: true })
  @Exclude({ toPlainOnly: true })
  email: string

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string

  @OneToMany(() => Auction, auction => auction.owner, { eager: false })
  @Exclude({ toPlainOnly: true })
  ownedAuctions: Promise<Auction[]>
}