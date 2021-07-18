import { EntityRepository, Repository } from 'typeorm';
import { Auction } from './auction.entity';

@EntityRepository(Auction)
export class AuctionsRepository extends Repository<Auction> {

}