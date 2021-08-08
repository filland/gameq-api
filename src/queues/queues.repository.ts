import { EntityRepository, Repository } from 'typeorm';
import { Queue } from './queue.entity';

@EntityRepository(Queue)
export class QueuesRepository extends Repository<Queue> {
}