import { Exclude } from 'class-transformer';
import { Queue } from 'src/queues/queue.entity';
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

  @OneToMany(() => Queue, queue => queue.owner, { eager: false, cascade: true })
  @Exclude({ toPlainOnly: true })
  ownedQueues: Promise<Queue[]>
}