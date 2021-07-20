import { EntityRepository, Repository } from 'typeorm';
import { Vote } from './vote.entity';

@EntityRepository(Vote)
export class VotesRepository extends Repository<Vote> {

}