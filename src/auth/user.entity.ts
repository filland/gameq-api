import { Task } from '../tasks/task.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ unique: true })
  username: string

  @Column()
  password: string

  @OneToMany(
    // type of the target
    _type => Task,
    // how current entity is called from the target
    task => task.user,
    // fetching strategy
    { eager: true })
  tasks: Task[]

}